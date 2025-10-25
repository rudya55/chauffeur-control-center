# 🔥 Configuration Firebase pour les Notifications Push

## 📋 Étapes à suivre

### 1️⃣ Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez-le avec le nom de votre application (ex: "VTC Dispatch")
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

**Variables Frontend (non utilisées pour l'app mobile Android - voir google-services.json) :**
```env
# Ces variables ne sont PAS nécessaires pour l'app Android
# L'app Android utilise uniquement android/app/google-services.json
# Ces variables seraient pour une version web PWA
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

### 5️⃣ Configurer l'application Android

**Pour l'app mobile Android :**

1. Dans Firebase Console, allez dans **Project Settings** (⚙️)
2. Dans l'onglet **Général**, descendez à "Vos applications"
3. Cliquez sur **"Ajouter une application"** > **Android**
4. Package Android : `com.vtcdispatch.app`
5. Téléchargez le fichier **google-services.json**
6. Placez-le dans `android/app/google-services.json` (remplacez le template)
7. Rebuild l'APK

**⚠️ IMPORTANT:** Le fichier `google-services.json` est ignoré par Git pour la sécurité. Gardez-le en local uniquement.

---

### 6️⃣ Configuration serveur (notifications push serveur)

### 6️⃣ Configuration serveur (notifications push serveur)

**Pour envoyer des notifications depuis le serveur :**

1. Dans Firebase Console > **Project Settings** > **Cloud Messaging**
2. Copiez la **Server Key** (clé serveur)
3. Créez un fichier `.env.server` à la racine du projet (ignoré par Git) :

```env
FCM_SERVER_KEY=votre_server_key_ici
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE=votre_service_role_key
```

4. Utilisez le script `send-notification.js` pour envoyer des notifications

**Migration Supabase (table fcm_tokens) :**

La migration `supabase/migrations/20251025115511_create_fcm_tokens.sql` crée la table pour stocker les tokens.
Appliquez-la via:
- GitHub Actions workflow `apply-fcm-migration.yml` (recommandé)
- Ou directement dans Supabase SQL Editor

---

### 7️⃣ Tester les notifications

**Sur Android :**
1. Installez l'APK avec le vrai `google-services.json`
2. Lancez l'app et acceptez les permissions
3. Le token FCM est automatiquement enregistré dans `fcm_tokens`
4. Créez une nouvelle réservation → notification locale s'affiche
5. Utilisez `send-notification.js` pour tester les push serveur

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
