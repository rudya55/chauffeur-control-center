# 🔧 Guide de dépannage : Problèmes de connexion et d'inscription

## ❌ Problème identifié
Votre clé Supabase (VITE_SUPABASE_PUBLISHABLE_KEY) semble incorrecte ou corrompue, ce qui empêche l'authentification de fonctionner.

## ✅ Solution : Récupérer la vraie clé Supabase

### Étape 1 : Accéder à votre projet Supabase

1. Allez sur https://supabase.com/dashboard
2. Connectez-vous avec votre compte
3. Sélectionnez le projet : **nulrmprnorszvsdenxqa**

### Étape 2 : Récupérer les clés API

1. Dans le menu de gauche, cliquez sur **⚙️ Project Settings** (Paramètres du projet)
2. Cliquez sur **API** dans le sous-menu
3. Vous verrez deux sections importantes :

   **Configuration :**
   - **Project URL** : `https://nulrmprnorszvsdenxqa.supabase.co`
   - **anon public** key : Une longue chaîne commençant par `eyJhbG...`
   
4. **Copiez exactement** la clé **anon public**

### Étape 3 : Mettre à jour le fichier .env

1. Ouvrez le fichier `.env` à la racine du projet
2. Remplacez **VITE_SUPABASE_PUBLISHABLE_KEY** par la vraie clé que vous venez de copier :

```env
VITE_SUPABASE_PROJECT_ID="nulrmprnorszvsdenxqa"
VITE_SUPABASE_PUBLISHABLE_KEY="COLLEZ_ICI_LA_VRAIE_CLE_ANON"
VITE_SUPABASE_URL="https://nulrmprnorszvsdenxqa.supabase.co"
```

### Étape 4 : Vérifier la configuration de l'authentification Supabase

Dans le dashboard Supabase :

1. Allez dans **Authentication** → **Settings**
2. Vérifiez ces paramètres :

   **Email Auth** (doit être activé) :
   - ✅ Enable email signup
   - ✅ Enable email confirmations (vous pouvez le désactiver pour les tests)
   
   **Email Templates** :
   - Vérifiez que les templates d'email sont bien configurés

   **Site URL** :
   - Mettez : `http://localhost:8080` ou `capacitor://localhost`

   **Redirect URLs** :
   - Ajoutez : 
     - `http://localhost:8080`
     - `capacitor://localhost`

### Étape 5 : Reconstruire l'application

Une fois le .env corrigé, il faut reconstruire l'application :

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

## 🧪 Test de diagnostic

J'ai créé un fichier de test : **test-supabase-connection.html**

Pour l'utiliser :
1. Ouvrez ce fichier dans un navigateur web
2. Remplacez `SUPABASE_ANON_KEY` par votre vraie clé
3. Testez la connexion, l'inscription et la connexion

## 🔍 Erreurs courantes

### Erreur: "Invalid API key"
- ➡️ La clé dans .env est incorrecte
- ✅ Récupérez la vraie clé depuis le dashboard Supabase

### Erreur: "Email not confirmed"  
- ➡️ L'email doit être confirmé avant la connexion
- ✅ Vérifiez vos emails ou désactivez la confirmation dans Supabase

### Erreur: "Invalid login credentials"
- ➡️ Email ou mot de passe incorrect
- ✅ Utilisez "Mot de passe oublié" pour réinitialiser

### Erreur: "User already registered"
- ➡️ Le compte existe déjà
- ✅ Utilisez la connexion au lieu de l'inscription

### Erreur: "Password should be at least 6 characters"
- ➡️ Mot de passe trop court
- ✅ Utilisez au moins 6 caractères

## 📝 Checklist de vérification

Avant de reconstruire l'APK, vérifiez :

- [ ] La vraie clé anon est dans .env (depuis le dashboard Supabase)
- [ ] L'URL Supabase est correcte : https://nulrmprnorszvsdenxqa.supabase.co
- [ ] L'authentification par email est activée dans Supabase
- [ ] Les URL de redirection sont configurées
- [ ] Le fichier .env est bien enregistré

## 🚀 Prochaines étapes

1. Récupérez la vraie clé Supabase depuis le dashboard
2. Mettez à jour .env avec cette clé
3. Testez avec test-supabase-connection.html
4. Si le test fonctionne, reconstruisez l'APK
5. Réinstallez l'APK sur votre téléphone

## 💡 Note importante

**Ne partagez JAMAIS votre clé Supabase publiquement** (dans un email, sur GitHub, etc.). C'est une clé sensible qui donne accès à votre base de données.

## 📞 Besoin d'aide ?

Si après avoir suivi ces étapes, ça ne fonctionne toujours pas :
1. Envoyez-moi le message d'erreur exact que vous voyez
2. Indiquez à quelle étape le problème se produit (inscription, connexion, etc.)
3. Vérifiez les logs dans Supabase Dashboard → Logs → Auth
