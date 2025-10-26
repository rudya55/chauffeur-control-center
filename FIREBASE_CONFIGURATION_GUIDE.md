# 🔥 Guide Complet de Configuration Firebase

## 📱 Vue d'ensemble

Ce guide vous accompagne pas à pas pour configurer Firebase pour votre application VTC Dispatch. Il existe **deux configurations différentes** selon la plateforme :

1. **📱 Application Android** : Nécessite `google-services.json`
2. **🌐 Application Web (PWA)** : Nécessite les variables d'environnement dans `.env`

---

## 🚀 Étape 1 : Créer un Projet Firebase

### 1.1 Accéder à Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Ajouter un projet"** (Add project)

### 1.2 Configurer le Projet

1. **Nom du projet** : Entrez un nom (ex: "VTC Dispatch Control Center")
2. **Google Analytics** : Vous pouvez désactiver cette option (optionnel)
3. Cliquez sur **"Créer le projet"**
4. Attendez que le projet soit créé (environ 30 secondes)
5. Cliquez sur **"Continuer"**

---

## 📱 Étape 2 : Configuration pour Android (google-services.json)

### 2.1 Ajouter une Application Android

1. Dans votre projet Firebase, cliquez sur l'icône **Android** (⚙️)
2. Cliquez sur **"Ajouter une application"** puis sélectionnez **Android**

### 2.2 Enregistrer l'Application

Remplissez les informations suivantes :

| Champ | Valeur |
|-------|--------|
| **Package Android** | `com.vtcdispatch.app` |
| **Surnom de l'app** | VTC Dispatch (optionnel) |
| **Certificat de signature SHA-1** | Laissez vide pour le moment |

Cliquez sur **"Enregistrer l'application"**

### 2.3 Télécharger google-services.json

1. Cliquez sur **"Télécharger google-services.json"**
2. Sauvegardez le fichier sur votre ordinateur

### 2.4 Placer le Fichier dans le Projet

**⚠️ IMPORTANT : Cette étape doit être faite sur un ordinateur (pas sur mobile)**

1. Ouvrez le projet sur votre ordinateur
2. Naviguez vers le dossier : `android/app/`
3. **Supprimez** le fichier `google-services.json.template` (si présent)
4. **Copiez** le fichier `google-services.json` téléchargé dans ce dossier
5. Vérifiez que le chemin est bien : `android/app/google-services.json`

**Structure attendue :**
```
android/
  └── app/
      ├── google-services.json  ← Votre nouveau fichier
      ├── build.gradle
      └── src/
```

### 2.5 Vérifier le Contenu

Ouvrez `android/app/google-services.json` et vérifiez qu'il ressemble à ceci :

```json
{
  "project_info": {
    "project_number": "123456789012",
    "project_id": "votre-projet-id",
    "storage_bucket": "votre-projet-id.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:123456789012:android:abcdef123456",
        "android_client_info": {
          "package_name": "com.vtcdispatch.app"
        }
      },
      "api_key": [
        {
          "current_key": "AIzaSy..."
        }
      ]
    }
  ]
}
```

**✅ Si les valeurs ne sont pas "REPLACE_ME" ou "your_xxx_here", c'est bon !**

---

## 🌐 Étape 3 : Configuration pour Web/PWA (Optionnel)

Si vous voulez aussi des notifications push sur la version web :

### 3.1 Récupérer les Identifiants Firebase

1. Dans Firebase Console, allez dans **Paramètres du Projet** (⚙️ en haut à gauche)
2. Sélectionnez l'onglet **Général**
3. Descendez jusqu'à **"Vos applications"**
4. Si vous n'avez pas d'app Web, cliquez sur l'icône **Web** `</>`
5. Entrez un surnom (ex: "VTC Web") et cliquez sur **"Enregistrer"**

### 3.2 Copier la Configuration Firebase

Vous verrez une configuration comme celle-ci :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 3.3 Obtenir la Clé VAPID

1. Toujours dans **Paramètres du Projet**
2. Allez dans l'onglet **Cloud Messaging**
3. Dans la section **"Web Push certificates"**
4. Si aucune clé n'existe, cliquez sur **"Générer une nouvelle paire de clés"**
5. Copiez la **clé publique VAPID** (commence par "B...")

### 3.4 Mettre à Jour le Fichier .env

Ouvrez le fichier `.env` à la racine du projet et remplacez les valeurs :

```env
# Firebase Configuration for Web/PWA Push Notifications
VITE_FIREBASE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
VITE_FIREBASE_AUTH_DOMAIN="votre-projet.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="votre-projet-id"
VITE_FIREBASE_STORAGE_BUCKET="votre-projet.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
VITE_FIREBASE_VAPID_KEY="BPxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## 🔔 Étape 4 : Activer Cloud Messaging

### 4.1 Activer l'API

1. Dans Firebase Console > **Paramètres du Projet** (⚙️)
2. Onglet **Cloud Messaging**
3. Activez **"Cloud Messaging API (Legacy)"** si ce n'est pas déjà fait

### 4.2 Récupérer la Clé Serveur (pour send-notification.js)

1. Dans **Cloud Messaging**, copiez la **"Server key"** (clé serveur)
2. Créez un fichier `.env.server` à la racine du projet :

```env
FCM_SERVER_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
SUPABASE_URL=https://gxwqvtsxktspfehhoubd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

**Note:** Le fichier `.env.server` est automatiquement ignoré par Git (ne sera pas publié).

---

## 🛠️ Étape 5 : Recompiler l'Application Android

Après avoir placé `google-services.json`, vous devez recompiler l'APK :

### Option A : Avec Capacitor CLI (Recommandé)

```bash
# Installer les dépendances si nécessaire
npm install

# Synchroniser le projet
npx cap sync android

# Ouvrir dans Android Studio
npx cap open android
```

Puis dans Android Studio :
1. **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
2. Attendez la compilation (peut prendre plusieurs minutes)
3. L'APK sera dans `android/app/build/outputs/apk/debug/`

### Option B : Via Gradle (Ligne de commande)

```bash
cd android
./gradlew assembleDebug
cd ..
```

L'APK sera dans `android/app/build/outputs/apk/debug/app-debug.apk`

---

## ✅ Étape 6 : Tester les Notifications

### 6.1 Installer l'APK

1. Transférez le nouvel APK sur votre téléphone
2. Installez-le (désinstallez l'ancienne version si nécessaire)
3. Ouvrez l'application
4. Connectez-vous

### 6.2 Vérifier l'Enregistrement du Token

L'application enregistre automatiquement le token FCM dans la table `fcm_tokens` de Supabase.

Pour vérifier :
1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. **Table Editor** > **fcm_tokens**
4. Vous devriez voir votre `user_id` et un `token`

### 6.3 Envoyer une Notification Test

```bash
node send-notification.js "Test de notification" "Ceci est un test"
```

Vous devriez recevoir la notification sur votre téléphone, même si l'app est fermée !

---

## 🔧 Dépannage

### Problème : "google-services.json" contient encore "REPLACE_ME"

**Solution :** Vous n'avez pas téléchargé le vrai fichier depuis Firebase Console. Recommencez l'Étape 2.

### Problème : Build Android échoue avec "google-services.json not found"

**Solution :** 
1. Vérifiez que le fichier est bien dans `android/app/google-services.json`
2. Vérifiez qu'il n'a pas d'extension cachée (comme `.json.txt`)

### Problème : Notifications ne fonctionnent pas

**Solutions :**
1. Vérifiez que la table `fcm_tokens` existe dans Supabase (voir [GUIDE_MIGRATION_MOBILE.md](GUIDE_MIGRATION_MOBILE.md))
2. Vérifiez que l'app a les permissions de notification activées (Paramètres Android)
3. Vérifiez que le token est bien sauvegardé dans Supabase
4. Vérifiez que la clé serveur dans `.env.server` est correcte

### Problème : "Firebase initialization error"

**Solution pour Web :**
- Vérifiez que toutes les variables `VITE_FIREBASE_*` sont bien remplies dans `.env`
- Relancez le serveur de développement : `npm run dev`

---

## 📋 Checklist Finale

- [ ] ✅ Projet Firebase créé
- [ ] ✅ Application Android enregistrée dans Firebase
- [ ] ✅ Fichier `google-services.json` téléchargé et placé dans `android/app/`
- [ ] ✅ Cloud Messaging activé
- [ ] ✅ APK recompilé avec le nouveau `google-services.json`
- [ ] ✅ Application installée et testée sur téléphone
- [ ] ✅ Token FCM enregistré dans Supabase (table `fcm_tokens`)
- [ ] ✅ Notification test envoyée avec succès
- [ ] ⬜ (Optionnel) Configuration web/PWA complétée
- [ ] ⬜ (Optionnel) `.env.server` créé pour les notifications serveur

---

## 🆘 Besoin d'Aide ?

### Ressources

- [Documentation Firebase](https://firebase.google.com/docs)
- [Guide Notifications Push](NOTIFICATIONS_GUIDE.md)
- [Migration Supabase](GUIDE_MIGRATION_MOBILE.md)

### Support

Si vous rencontrez des difficultés :
1. Vérifiez que vous avez suivi toutes les étapes dans l'ordre
2. Consultez la section Dépannage ci-dessus
3. Créez une issue sur GitHub avec :
   - La description du problème
   - Les captures d'écran des erreurs
   - Les étapes que vous avez déjà tentées

---

**📱 Note Importante :** 
La configuration de `google-services.json` est **essentielle** pour l'application Android. Sans ce fichier correctement configuré, les notifications push ne fonctionneront pas. Prenez le temps de suivre chaque étape attentivement.
