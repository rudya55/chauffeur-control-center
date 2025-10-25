# Android skeleton for MyApp

Fichiers ajoutés :

- `settings.gradle` — nom du projet et inclusion du module `:app`
- `build.gradle` — build script racine (Android Gradle Plugin)
- `gradle.properties` — propriétés basiques
- `app/build.gradle` — configuration du module `app` (Kotlin + Compose)
- `app/src/main/AndroidManifest.xml` — manifest de l'application
- `app/src/main/java/com/example/myapp/MainActivity.kt` — activité principale Compose

Remarques et étapes suivantes :

1. Ce squelette est minimal et fonctionne mieux si tu l'ouvres avec Android Studio (qui va proposer d'ajouter le Gradle wrapper et synchroniser).
2. Si tu veux construire en ligne de commande tu dois ajouter le Gradle wrapper (`gradle wrapper`) ou utiliser la version de Gradle installée localement compatible avec AGP 8.3.
3. Si ton but est d'intégrer Capacitor (le projet contient `capacitor.config.ts`), la façon recommandée est d'exécuter depuis la racine du projet :

```bash
# installer capacitor si nécessaire
npx cap add android
# puis synchroniser la web build dans Android:
npx cap copy android
npx cap open android
```

4. Dis-moi si tu veux que j'ajoute : Gradle wrapper, icônes, flavours, ou intégration Capacitor directement dans ce repo.
