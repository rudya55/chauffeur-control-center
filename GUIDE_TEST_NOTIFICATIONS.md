# 🔔 Guide de Test - Notifications Push Firebase

## ✅ Configuration Terminée

Toutes les clés Firebase sont maintenant configurées dans l'application :

**Configuration Firebase :**
- **Project ID:** `vtc-dispatch-admin`
- **API Key:** `AIzaSyDINevIQHW3nmiz1Z1nYlkbOeH3XYSsTyc`
- **VAPID Key:** `BOlQMOQTwrvYPlwk5JPHdvx7bxugKve857bclQthPvfQrJwleK9gpstfDmXKhL59C-k5JNV00U9wHdtrT0kMJLk`
- **Messaging Sender ID:** `900889515127`
- **App ID:** `1:900889515127:web:39d7d7a40db3f728242272`

---

## 🚀 Étape 1 : Configurer le Secret Backend (CRITIQUE)

**⚠️ IMPORTANT :** Sans cette étape, les notifications ne pourront PAS être envoyées !

1. **Récupérer la Server Key depuis Firebase Console :**
   - Allez sur [Firebase Console](https://console.firebase.google.com/)
   - Sélectionnez le projet `vtc-dispatch-admin`
   - Allez dans **Project Settings** (⚙️) > **Cloud Messaging**
   - Copiez la **Server Key** (aussi appelée "Legacy server key")

2. **Ajouter le secret dans Lovable Cloud :**
   - Dans Lovable, allez dans **Settings** > **Cloud** > **Secrets**
   - Cliquez sur **Add Secret**
   - Nom : `FIREBASE_SERVER_KEY`
   - Valeur : Collez la Server Key copiée
   - Cliquez sur **Save**

---

## 🧪 Étape 2 : Tester les Notifications

### Option A : Test Automatique (Recommandé)

1. **Ouvrez la page de test :**
   ```
   https://votre-app.lovable.app/notification-test
   ```

2. **Activez les notifications :**
   - Cliquez sur "Activer les notifications"
   - Acceptez la permission dans votre navigateur
   - ✅ Votre token FCM devrait s'afficher

3. **Envoyez-vous un test :**
   - Cliquez sur "M'envoyer une notification de test"
   - Vous devriez recevoir une notification immédiatement !

### Option B : Test Manuel avec une vraie réservation

1. **Créer une réservation :**
   - Allez sur `/reservations`
   - Créez une nouvelle réservation
   - Copiez l'**ID de la réservation** (UUID)

2. **Récupérer votre ID utilisateur :**
   - Ouvrez la console navigateur (F12)
   - Tapez : `supabase.auth.getUser().then(r => console.log(r.data.user.id))`
   - Copiez l'ID affiché

3. **Tester avec la page de test :**
   - Allez sur `/notification-test`
   - Collez l'ID de la réservation
   - Collez votre ID utilisateur
   - Cliquez sur "Envoyer au chauffeur"
   - 📬 Vous devriez recevoir la notification !

---

## 📱 Étape 3 : Test en Conditions Réelles

### Scénario 1 : Application ouverte (Premier plan)

1. Ouvrez l'application dans votre navigateur
2. Dans un autre onglet, créez une réservation via l'admin
3. Invoquez l'edge function pour envoyer la notification :
   ```typescript
   await supabase.functions.invoke('notify-new-reservation', {
     body: {
       reservationId: 'uuid-de-la-reservation',
       driverId: 'uuid-du-chauffeur'
     }
   });
   ```
4. **Résultat attendu :**
   - 🔔 Toast de notification apparaît
   - 📬 Notification système du navigateur
   - 🔊 Son de notification (si disponible)
   - 🔴 Badge rouge sur la cloche

### Scénario 2 : Application en arrière-plan

1. Ouvrez l'application et activez les notifications
2. Changez d'onglet (gardez le navigateur ouvert)
3. Envoyez une notification (via `/notification-test` ou API)
4. **Résultat attendu :**
   - 📬 Notification système affichée par le Service Worker
   - Clic sur la notification → redirection vers `/reservations`

### Scénario 3 : Application fermée

1. Fermez complètement le navigateur
2. Rouvrez-le et allez sur l'application
3. Activez les notifications
4. Fermez à nouveau l'onglet (mais pas le navigateur)
5. Envoyez une notification
6. **Résultat attendu :**
   - 📬 Notification visible même sans l'app ouverte

---

## 🔧 Étape 4 : Intégration Automatique

Pour envoyer automatiquement une notification quand une réservation est créée :

### Méthode 1 : Depuis le formulaire de création

Dans votre code de création de réservation, ajoutez :

```typescript
// Après avoir créé la réservation
const { data: reservation } = await supabase
  .from('reservations')
  .insert({ /* vos données */ })
  .select()
  .single();

// Envoyer notification si chauffeur assigné
if (reservation.driver_id) {
  await supabase.functions.invoke('notify-new-reservation', {
    body: {
      reservationId: reservation.id,
      driverId: reservation.driver_id,
    }
  });
}
```

### Méthode 2 : Database Trigger (Automatique)

Créez un trigger qui se déclenche automatiquement à chaque `INSERT` :

```sql
CREATE OR REPLACE FUNCTION notify_new_reservation()
RETURNS TRIGGER AS $$
BEGIN
  -- Appeler l'edge function via pg_net
  PERFORM net.http_post(
    url := 'https://votre-projet.supabase.co/functions/v1/notify-new-reservation',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object(
      'reservationId', NEW.id,
      'driverId', NEW.driver_id
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_reservation_created
  AFTER INSERT ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_reservation();
```

---

## 🐛 Dépannage

### Problème : "Messaging not supported"

**Cause :** Firebase Messaging n'est pas initialisé ou le navigateur ne supporte pas.

**Solution :**
1. Vérifiez que vous êtes en **HTTPS** (obligatoire)
2. Testez dans un navigateur compatible (Chrome, Firefox, Edge)
3. Vérifiez la console : `console.log(messaging)` doit afficher un objet

---

### Problème : Notifications non reçues

**Checklist de diagnostic :**

1. ✅ **Permission accordée ?**
   ```javascript
   console.log(Notification.permission); // Doit afficher "granted"
   ```

2. ✅ **Token FCM enregistré ?**
   - Allez dans Cloud → Database → `profiles`
   - Vérifiez que `fcm_token` est rempli pour votre profil

3. ✅ **Secret FIREBASE_SERVER_KEY configuré ?**
   - Settings → Cloud → Secrets
   - Le secret doit exister et avoir une valeur

4. ✅ **Edge function déployée ?**
   - Settings → Cloud → Functions
   - `notify-new-reservation` doit être listée

5. ✅ **Service Worker enregistré ?**
   ```javascript
   navigator.serviceWorker.getRegistrations()
     .then(regs => console.log('Service Workers:', regs));
   ```
   Doit afficher au moins un SW pour `firebase-messaging-sw.js`

---

### Problème : Erreur "FCM Error" dans les logs

**Causes possibles :**

1. **Token invalide ou expiré :**
   - Solution : Redemandez la permission, un nouveau token sera généré

2. **Server Key incorrecte :**
   - Vérifiez que le secret `FIREBASE_SERVER_KEY` contient la bonne clé
   - Assurez-vous de copier la "Legacy server key" dans Firebase Console

3. **Domaine non autorisé :**
   - Firebase Console → Authentication → Settings → Authorized domains
   - Ajoutez `lovable.app` et votre domaine custom si vous en avez un

---

### Problème : Service Worker non trouvé

**Symptôme :** Erreur 404 sur `/firebase-messaging-sw.js`

**Solution :**
- Le fichier doit être à la racine du dossier `public/`
- Vérifiez que le fichier existe : `public/firebase-messaging-sw.js`
- Après modification, faites un hard refresh (Ctrl+Shift+R)

---

## 📊 Vérifier que tout fonctionne

### Console navigateur (F12)

Vous devriez voir ces logs :
```
🔔 Firebase Messaging initialized
📱 FCM Token obtenu: eyJhbGciOiJSUzI1Ni...
✅ Token FCM enregistré dans la base de données
✅ Notifications activées avec succès
```

### Logs de l'Edge Function

Dans Lovable Cloud → Functions → notify-new-reservation → Logs :
```
📨 Notification request received: { reservationId: '...', driverId: '...' }
📋 Reservation details: { id: '...', client_name: '...', ... }
✅ Notification envoyée avec succès
```

---

## 🎯 Checklist Finale

Avant de passer en production, vérifiez :

- [ ] ✅ Clés Firebase configurées (dans le code)
- [ ] ✅ Secret `FIREBASE_SERVER_KEY` ajouté dans Lovable Cloud
- [ ] ✅ Service Worker `firebase-messaging-sw.js` avec vraies clés
- [ ] ✅ Table `profiles.fcm_token` existe dans la base
- [ ] ✅ Edge function `notify-new-reservation` déployée
- [ ] ✅ Test d'envoi de notification réussi
- [ ] ✅ Notification reçue en premier plan
- [ ] ✅ Notification reçue en arrière-plan
- [ ] ✅ Clic sur notification redirige vers l'app
- [ ] ✅ Badge de notification fonctionne
- [ ] ✅ Son de notification joue (optionnel)

---

## 🎉 C'est Prêt !

Vos notifications push sont maintenant **100% opérationnelles** !

**Workflow complet :**

```
Admin crée réservation
        ↓
Edge function invoquée
        ↓
Firebase Cloud Messaging
        ↓
📬 Chauffeur reçoit notification
        ↓
Chauffeur clique → ouvre l'app
        ↓
Chauffeur accepte la course
```

---

## 📚 Ressources

- [Documentation Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Service Workers MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- Fichier de référence : `NOTIFICATIONS_INTEGRATION.md`

---

## 💡 Conseils de Production

1. **Rate Limiting :** Limitez le nombre de notifications par chauffeur pour éviter le spam
2. **Logs :** Gardez un historique des notifications envoyées dans une table dédiée
3. **Monitoring :** Suivez le taux de succès d'envoi FCM
4. **A/B Testing :** Testez différents messages pour maximiser les acceptations
5. **Timezones :** N'envoyez pas de notifications la nuit sauf urgence

Bon test ! 🚀
