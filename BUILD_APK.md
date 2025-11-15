# Comment générer l'APK

## Prérequis
- Java JDK 11 ou supérieur installé
- Android SDK installé (ou Android Studio)

## Étapes pour générer l'APK

### 1. APK de Debug (pour tests)

```bash
cd android
./gradlew assembleDebug
```

L'APK sera généré dans : `android/app/build/outputs/apk/debug/app-debug.apk`

### 2. APK de Release (pour distribution)

```bash
cd android
./gradlew assembleRelease
```

L'APK sera généré dans : `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### 3. Installer l'APK sur un appareil

```bash
# Via USB
adb install app/build/outputs/apk/debug/app-debug.apk

# Ou transférez le fichier APK sur votre téléphone et installez-le manuellement
```

## Modification de l'application

Si vous modifiez le code source React :

```bash
# 1. Rebuild l'application web
npm run build

# 2. Synchroniser avec Android
npx cap sync android

# 3. Générer le nouvel APK
cd android
./gradlew assembleDebug
```

## Informations de l'application

- **App ID** : com.chauffeur.controlcenter
- **App Name** : chauffeur-control-center
- **Version** : 1.0 (versionCode: 1)

## Personnalisation

### Changer l'icône de l'application
Remplacez les fichiers dans : `android/app/src/main/res/mipmap-*/ic_launcher.png`

### Changer le splash screen
Remplacez les fichiers dans : `android/app/src/main/res/drawable*/splash.png`

### Changer le nom de l'application
Modifiez : `android/app/src/main/res/values/strings.xml`
