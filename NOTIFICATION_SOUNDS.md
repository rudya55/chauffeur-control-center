# Notification sounds

Ce fichier explique comment fournir des sons pour les notifications Android et Web.

Emplacement attendu :

- Fichiers web : `public/sounds/<key>.wav` (ou .mp3/.ogg)
- Fichiers natifs Android : `android/app/src/main/res/raw/<key>.wav` (ou .mp3)

Fichiers d'exemple
-------------------

Pour faciliter les tests, des fichiers base64 d'exemple ont été ajoutés dans `public/sounds/*.b64`.
Exécutez :

```bash
node scripts/decode-sounds.js
```

Ce script décodera les `.b64` en fichiers audio valides dans :

- `public/sounds/<key>.wav`
- `android/app/src/main/res/raw/<key>.wav`

Remarques :

- Les fichiers ajoutés ici sont des placeholders (courts fichiers silencieux). Remplacez-les par des sons réels avant de publier.
- Android : si une ressource `res/raw/<key>` est présente, la chaîne native correspondante utilisera ce son. Sinon, Android utilisera le son système par défaut.
- Web : le code essaie d'abord de charger `/sounds/<key>.(mp3|ogg|wav)` et, si absent, utilise un fallback WebAudio qui produit des tonalités distinctes.

Bonnes pratiques :

- Fournis des fichiers .ogg ou .mp3 optimisés pour mobile (~20-50 KB) pour éviter d'alourdir l'app.
- Si tu veux des sons différents pour chaque type de notification, crée des fichiers `alert1`, `alert2`, `chime`, `default` (ou modifie `SOUND_KEYS` dans `MainActivity.java` et la logique côté client).

Guide rapide - Sons de notification natifs et web

But : permettre à l'application d'utiliser plusieurs sons de notifications que l'utilisateur peut choisir dans les paramètres.

Clés attendues (valeurs stockées en localStorage sous "notification-sound") :
- default (son de notification système)
- alert1 (fichier res/raw/alert1.mp3 et web /public/sounds/alert1.mp3)
- alert2 (fichier res/raw/alert2.mp3 et web /public/sounds/alert2.mp3)
- chime  (fichier res/raw/chime.mp3  et web /public/sounds/chime.mp3)

Étapes pour Android (build natif) :
1. Placer vos fichiers audio (ex: alert1.mp3, alert2.mp3, chime.mp3) dans :
   android/app/src/main/res/raw/
   (créez le dossier raw si absent)
2. Les fichiers doivent être nommés exactement : alert1.mp3, alert2.mp3, chime.mp3
3. Le code natif crée automatiquement un canal de notification par clé :
   rides_channel_default, rides_channel_alert1, rides_channel_alert2, rides_channel_chime
   Ces channels utilisent le son correspondant si le fichier raw existe, sinon retombent sur le son système.

Étapes pour Web (PWA) :
1. Placer vos fichiers audio web dans : public/sounds/
   Ex: public/sounds/alert1.mp3, public/sounds/alert2.mp3, public/sounds/chime.mp3
2. Le lecteur web essaiera de jouer ces fichiers quand une notification arrive en foreground.

Code JS/TS :
- La clé choisie est lue depuis localStorage.getItem('notification-sound'). Si absente, la valeur 'default' est utilisée.
- Pour Android, le service de notifications passe le channelId construit comme rides_channel_<key> lors de la programmation des notifications.

Notes importantes :
- Les channels Android sont permanents une fois créés par le système : si vous modifiez le fichier sonore mais gardez le même channel id, changez le nom du channel id ou supprimez/recréez l'application pour appliquer le nouveau son. Pour déployer un nouveau son en production, augmentez l'identifiant du channel si nécessaire.
- Si vous voulez une interface pour choisir le son dans l'app, il suffit de sauvegarder la clé (ex: 'alert1') dans localStorage sous 'notification-sound' et la logique existante utilisera automatiquement ce channel.

Exemple minimal pour sauvegarder la préférence :
localStorage.setItem('notification-sound', 'alert1');

Si vous voulez, je peux :
- ajouter une UI de paramètres pour choisir le son et sauvegarder la préférence,
- ajouter des fichiers sonores d'exemple (petits fichiers mp3) dans public/sounds et android res/raw,
- automatiser l'ajout de ces sons dans le build CI (injection si nécessaire).
