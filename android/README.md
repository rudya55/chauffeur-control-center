# Android App Configuration

## 🔥 Firebase Setup - google-services.json

### ⚠️ REQUIRED: Configure Firebase Before Building

The file `google-services.json.template` in this directory is a **template only**. You must replace it with your actual Firebase configuration file.

### Quick Setup Steps

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create one)
3. Add an Android app with package name: `com.vtcdispatch.app`
4. Download `google-services.json`
5. Place it in: `android/app/google-services.json`
6. Delete the template file
7. Rebuild the APK

### 📖 Detailed Instructions

See the complete guide: **[FIREBASE_CONFIGURATION_GUIDE.md](../../FIREBASE_CONFIGURATION_GUIDE.md)**

### 🔒 Security Note

The file `google-services.json` is automatically ignored by Git and should **never** be committed to version control. Each developer/deployment needs their own copy.

### Building the APK

After placing the correct `google-services.json`:

```bash
# Sync Capacitor
npx cap sync android

# Build APK (from android directory)
cd android
./gradlew assembleDebug

# Or build release
./gradlew assembleRelease
```

The APK will be in: `android/app/build/outputs/apk/`

---

**Need help?** Check the [main documentation](../../FIREBASE_CONFIGURATION_GUIDE.md) or create an issue.
