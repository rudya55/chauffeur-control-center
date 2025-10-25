# 🔔 Guide de Test des Notifications Push Firebase

## 📱 APK Disponible

**Fichier** : `VTC-Dispatch-v2.6-debug.apk`  
**Taille** : 7.9 MB  
**Package** : `com.vtcdispatch.app`  
**Version** : 2.6 (Debug)

---

## 🚀 Installation de l'APK

1. **Téléchargez** `VTC-Dispatch-v2.6-debug.apk` sur votre téléphone Android
2. **Activez "Sources inconnues"** :
   - Paramètres → Sécurité → Autoriser les installations de sources inconnues
3. **Installez l'APK** en cliquant dessus
4. **Ouvrez l'app** et connectez-vous

---

## 🔥 Tester les Notifications Push depuis Firebase Console

### Méthode 1 : Test Simple (Firebase Console)

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **vtc-dispatch**
3. Dans le menu de gauche, cliquez sur **Messaging** (Cloud Messaging)
4. Cliquez sur **Créer votre première campagne** ou **Nouvelle campagne**
5. Choisissez **Notifications Firebase**
6. Remplissez :
   - **Titre** : "Nouvelle course disponible"
   - **Texte** : "Un client vous a réservé - Paris → Orly"
   - **Image** (optionnel) : URL d'une image
7. Cliquez sur **Suivant**
8. **Ciblage** :
   - Sélectionnez votre app **com.vtcdispatch.app**
   - Topic : laissez vide pour tester avec tous les appareils
9. Cliquez sur **Suivant** puis **Publier**

### Méthode 2 : Test avec Token (Plus précis)

1. **Ouvrez l'app** sur votre téléphone
2. **Vérifiez les logs** dans Supabase pour récupérer le token FCM :
   - Allez sur Supabase → Table `fcm_tokens`
   - Copiez le `token` de votre utilisateur
3. Dans Firebase Console → **Messaging** → **Nouvelle notification**
4. Au lieu de choisir "App", choisissez **"Envoyer un message de test"**
5. Collez le **token FCM** et cliquez sur **Test**

---

## 📊 Tester avec votre Backend (Production)

Votre app utilise déjà une **Supabase Edge Function** pour envoyer des notifications.

### Déclencheur automatique :

Les notifications sont envoyées **automatiquement** quand :

1. ✅ Une **nouvelle réservation** est créée dans Supabase
2. ✅ Le statut d'une course change (`pending` → `accepted`, etc.)
3. ✅ Un message est envoyé dans le chat

### Tester manuellement :

1. **Créez une réservation** depuis le dashboard web
2. L'app mobile **recevra immédiatement** une notification
3. Cliquez sur la notification → l'app s'ouvre sur la réservation

---

## 🛠️ Vérifier que tout fonctionne

### Checklist :

- [ ] L'app s'installe correctement
- [ ] Vous pouvez vous connecter
- [ ] L'app demande la permission pour les notifications (popup)
- [ ] Le token FCM est sauvegardé dans Supabase (table `fcm_tokens`)
- [ ] Vous recevez les notifications test depuis Firebase Console
- [ ] Les notifications fonctionnent même **app fermée**
- [ ] Les notifications fonctionnent en **arrière-plan**
- [ ] Cliquer sur une notification ouvre l'app

---

## 🔧 Dépannage

### Problème : Pas de notification reçue

**Solutions** :

1. Vérifiez que vous avez **accepté les permissions** de notification
2. Vérifiez que le **token FCM** est bien dans la table `fcm_tokens` de Supabase
3. Vérifiez que le **package name** dans Firebase est `com.vtcdispatch.app`
4. Réinstallez l'app et accordez à nouveau les permissions
5. Testez avec **Firebase Console → Test Message** en utilisant votre token

### Problème : Token non sauvegardé

1. Vérifiez que vous êtes **connecté** dans l'app
2. Vérifiez les **logs de la console** (si connectée via USB)
3. Vérifiez que la table `fcm_tokens` existe dans Supabase

### Problème : Notification arrive mais ne s'affiche pas

1. Vérifiez les **paramètres de notification** de l'app dans Android
2. Désactivez le mode **Ne pas déranger**
3. Assurez-vous que les notifications ne sont pas bloquées pour l'app

---

## 📝 Structure du Payload de Notification

Quand vous envoyez une notification depuis votre backend, utilisez ce format :

```json
{
  "notification": {
    "title": "Nouvelle course",
    "body": "Paris → Aéroport CDG - 45€"
  },
  "data": {
    "reservation_id": "123",
    "type": "new_reservation",
    "click_action": "OPEN_RESERVATION"
  },
  "token": "le_token_fcm_de_l_utilisateur"
}
```

---

## ✅ Fonctionnalités Configurées

- ✅ **Google Maps** avec clé API
- ✅ **Firebase Cloud Messaging** (notifications push)
- ✅ **Supabase** (base de données en temps réel)
- ✅ **Notifications en temps réel** même app fermée
- ✅ **Gestion des réservations**
- ✅ **Chat en direct**
- ✅ **Calendrier**
- ✅ **Suivi GPS**

---

## 🚀 Prochaines Étapes

Pour publier sur le **Google Play Store**, vous devrez :

1. Créer un **keystore** pour signer l'APK
2. Générer un **APK Release** signé
3. Créer un compte **Google Play Developer** (25$ unique)
4. Uploader l'APK sur le Play Console

---

**Besoin d'aide ?** Consultez la [documentation Firebase](https://firebase.google.com/docs/cloud-messaging/android/client) ou [Capacitor Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
