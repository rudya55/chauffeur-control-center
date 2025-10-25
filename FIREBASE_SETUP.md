# 🔥 Configuration Firebase pour les Notifications Push

## 📋 Étapes à suivre

### 1️⃣ Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez-le (ex: "VTC Driver App")
4. Désactivez Google Analytics (optionnel)
5. Cliquez sur "Créer le projet"

---

### 2️⃣ Activer Cloud Messaging

1. Dans votre projet Firebase, allez dans **Project Settings** (⚙️ en haut à gauche)
2. Allez dans l'onglet **Cloud Messaging**
3. Activez **Cloud Messaging API (Legacy)** si ce n'est pas déjà fait

---

### 3️⃣ Récupérer les identifiants Firebase

#### Dans Project Settings > General :
- `API Key` → Copiez la clé API
- `Project ID` → Copiez l'ID du projet
- `Messaging Sender ID` → Copiez l'ID d'expéditeur
- `App ID` → Copiez l'ID de l'application

#### Dans Project Settings > Cloud Messaging :
- `Server Key` → Copiez la clé serveur (pour l'edge function)
- `Web Push certificates` → Générez une paire de clés VAPID et copiez la clé publique

---

### 4️⃣ Ajouter les variables d'environnement dans Lovable

Dans votre projet Lovable, ajoutez ces secrets :

**Variables Frontend (.env local pour tester) :**
```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_FIREBASE_VAPID_KEY=votre_cle_vapid_publique
```

**Variable Backend (Lovable Cloud Secret) :**
- Nom: `FIREBASE_SERVER_KEY`
- Valeur: La Server Key de Cloud Messaging

---

### 5️⃣ Mettre à jour le Service Worker

Éditez le fichier `public/firebase-messaging-sw.js` et remplacez la configuration Firebase par vos vraies valeurs :

```javascript
firebase.initializeApp({
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID"
});
```

---

### 6️⃣ Ajouter une migration pour le token FCM

Il faut ajouter une colonne `fcm_token` dans la table `profiles` :

```sql
ALTER TABLE profiles ADD COLUMN fcm_token TEXT;
```

---

### 7️⃣ Tester les notifications

1. Ouvrez votre app en HTTPS (obligatoire pour les notifications)
2. Acceptez les permissions de notification
3. Le token FCM sera automatiquement stocké dans votre profil
4. Utilisez l'edge function `send-notification` pour envoyer une notification test

---

## 📱 Comment envoyer une notification

### Depuis un Edge Function ou votre code backend :

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('fcm_token')
  .eq('id', driverId)
  .single();

if (profile?.fcm_token) {
  await supabase.functions.invoke('send-notification', {
    body: {
      fcmToken: profile.fcm_token,
      title: 'Nouvelle course !',
      body: 'Une réservation vous attend',
      data: {
        url: '/reservations',
        reservationId: 'xxx'
      }
    }
  });
}
```

---

## ✅ Vérification

- [ ] Projet Firebase créé
- [ ] Cloud Messaging activé
- [ ] Identifiants récupérés
- [ ] Variables d'environnement ajoutées à Lovable
- [ ] Service Worker configuré
- [ ] Migration `fcm_token` exécutée
- [ ] Permissions de notification acceptées dans le navigateur
- [ ] Token FCM sauvegardé dans la base de données

---

## 🚨 Points importants

1. **HTTPS obligatoire** : Les notifications push ne fonctionnent qu'en HTTPS
2. **Permissions** : L'utilisateur doit accepter les notifications
3. **Service Worker** : Doit être enregistré à la racine (`/firebase-messaging-sw.js`)
4. **Domaines autorisés** : Ajoutez votre domaine dans Firebase Console > Authentication > Settings

---

## 🔧 Dépannage

**Erreur "Service Worker registration failed"**
→ Vérifiez que le fichier est bien à `/firebase-messaging-sw.js`

**Token null ou undefined**
→ Vérifiez que les permissions sont accordées et que vous êtes en HTTPS

**Notifications non reçues**
→ Vérifiez la Server Key dans les secrets Lovable Cloud

**"Messaging is not supported"**
→ Vérifiez que vous êtes en contexte sécurisé (HTTPS)
