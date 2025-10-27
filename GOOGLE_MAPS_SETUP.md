# 🗺️ Configuration Google Maps pour VTC Dispatch

## Problème actuel
La clé Google Maps utilisée dans l'application est une clé de démonstration qui ne fonctionne plus ou a des restrictions.

## ✅ Solution : Créer votre propre clé Google Maps API

### Étape 1 : Créer un projet Google Cloud

1. Allez sur : **https://console.cloud.google.com/**
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Sélectionner un projet"** en haut
4. Cliquez sur **"NOUVEAU PROJET"**
5. Donnez un nom : **"VTC Dispatch"**
6. Cliquez sur **"Créer"**

### Étape 2 : Activer l'API Google Maps

1. Dans le menu ☰ à gauche, allez sur **"API et services"** → **"Bibliothèque"**
2. Recherchez et activez ces APIs :
   - ✅ **Maps JavaScript API**
   - ✅ **Geocoding API** (pour les adresses)
   - ✅ **Directions API** (pour les itinéraires)
   - ✅ **Places API** (pour la recherche de lieux)

3. Pour chaque API :
   - Cliquez sur l'API
   - Cliquez sur **"ACTIVER"**

### Étape 3 : Créer une clé API

1. Dans le menu ☰, allez sur **"API et services"** → **"Identifiants"**
2. Cliquez sur **"+ CRÉER DES IDENTIFIANTS"**
3. Sélectionnez **"Clé API"**
4. Une clé sera générée (elle ressemble à : `AIzaSyXXXXXXXXXXXXXXXXXXXX`)
5. **COPIEZ CETTE CLÉ** ✂️

### Étape 4 : Sécuriser votre clé (Important !)

1. Cliquez sur **"Modifier la clé API"** (icône crayon)
2. Dans **"Restrictions de l'application"** :
   - Sélectionnez **"Applications Android"**
   - Cliquez sur **"+ AJOUTER UN PACKAGE ET UNE EMPREINTE"**
   
3. Remplissez :
   - **Nom du package** : `com.vtcdispatch.app`
   - **Empreinte SHA-1** : Obtenez-la avec cette commande :
   
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
   
   Copiez la ligne qui commence par `SHA1:`

4. Dans **"Restrictions liées aux API"** :
   - Sélectionnez **"Restreindre la clé"**
   - Cochez :
     - ✅ Maps JavaScript API
     - ✅ Geocoding API
     - ✅ Directions API
     - ✅ Places API

5. Cliquez sur **"Enregistrer"**

### Étape 5 : Me donner la clé

Envoyez-moi simplement votre nouvelle clé Google Maps, et je vais :
1. Mettre à jour le code
2. Reconstruire l'APK v3.1
3. La publier sur GitHub

## 💡 Alternative : Utiliser une clé non restreinte pour les tests

Si vous voulez tester rapidement :
1. Créez la clé API
2. Ne mettez PAS de restrictions
3. Envoyez-moi la clé
4. Je rebuild l'APK immédiatement

⚠️ **Attention** : Une clé non restreinte peut être utilisée par n'importe qui. Ajoutez des restrictions une fois les tests terminés.

## 📊 Tarification Google Maps

- ✅ **GRATUIT** jusqu'à 28 000 chargements de cartes par mois
- ✅ **200$ de crédit gratuit par mois** de Google
- Largement suffisant pour une application VTC

## 🆘 Problème avec Google Maps ?

Si vous ne voulez pas configurer Google Maps maintenant, je peux :
- Utiliser une carte OpenStreetMap gratuite (pas de clé nécessaire)
- Ou laisser la carte désactivée temporairement

**Que préférez-vous ?**
1. Me donner votre clé Google Maps API
2. Utiliser OpenStreetMap (gratuit, pas de config)
3. Désactiver la carte temporairement
