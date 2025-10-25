# 🔔 Guide des Notifications Push Firebase

## 📋 Configuration actuelle

✅ **Clé serveur Firebase configurée** dans `.env.server`  
✅ **Application Android prête** à recevoir les notifications  
✅ **Script d'envoi** disponible: `send-notification.js`

---

## 🚀 Comment envoyer une notification push

### Prérequis
1. Avoir exécuté la migration Supabase pour créer la table `fcm_tokens`
2. Au moins un utilisateur connecté via l'app Android (pour enregistrer son token)
3. Node.js installé sur votre serveur/PC

### Installation des dépendances
```bash
npm install dotenv @supabase/supabase-js
```

### Configuration
Éditez `.env.server` et ajoutez votre clé Service Role Supabase :
```env
FCM_SERVER_KEY=BCPrfQzSH-vSfIy2BykGd5_TOL_q1XDs-yq6vMbWLN_ws0hki-y23yVwCrbgDizcPjrtdit-LfulEYIxowi_yjo
SUPABASE_URL=https://gxwqvtsxktspfehhoubd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<VOTRE_CLE_ICI>
```

**Où trouver la clé Service Role ?**
- Allez sur https://supabase.com/dashboard
- Sélectionnez votre projet
- Settings > API > `service_role` secret

---

## 📤 Utilisation du script

### Envoyer une notification à tous les chauffeurs
```bash
node send-notification.js "Nouvelle course disponible" "Départ: Aéroport CDG, Destination: Paris Centre"
```

### Envoyer à un utilisateur spécifique
```bash
node send-notification.js "Votre course a été acceptée" "Le chauffeur arrive dans 10 min" abc-123-user-uuid
```

---

## 🔗 Intégration automatique

### Option 1: Supabase Edge Function (Recommandé)
Créez une fonction Supabase qui s'exécute automatiquement lors d'une nouvelle réservation :

```typescript
// supabase/functions/send-push-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY')!

serve(async (req) => {
  const { record } = await req.json()
  
  // Récupérer les tokens des chauffeurs disponibles
  const { data: tokens } = await supabaseAdmin
    .from('fcm_tokens')
    .select('token')
  
  // Envoyer notification à chaque chauffeur
  for (const { token } of tokens || []) {
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FCM_SERVER_KEY}`
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: '🚗 Nouvelle course !',
          body: `Départ: ${record.pickup_address}`,
          icon: 'ic_launcher',
          sound: 'default'
        }
      })
    })
  }
  
  return new Response('OK')
})
```

Activez avec un Database Webhook :
- Supabase Dashboard > Database > Webhooks
- Table: `reservations`
- Events: `INSERT`
- HTTP Request: POST vers votre Edge Function

### Option 2: Cron Job (Polling)
Créez un cron qui vérifie les nouvelles réservations toutes les minutes :

```bash
# crontab -e
* * * * * cd /path/to/project && node check-new-reservations.js
```

### Option 3: Appel direct depuis votre backend
Importez le module dans votre code serveur :

```javascript
const { sendNotificationToAll } = require('./send-notification.js')

// Lors de la création d'une réservation
app.post('/api/reservations', async (req, res) => {
  const reservation = await createReservation(req.body)
  
  // Envoyer notification
  await sendNotificationToAll(
    '🚗 Nouvelle course',
    `Départ: ${reservation.pickup_address}`
  )
  
  res.json(reservation)
})
```

---

## 🧪 Test rapide

1. **Lancez l'app Android** sur votre téléphone
2. **Connectez-vous** (l'app enregistrera automatiquement votre token FCM)
3. **Envoyez une notification test** :
   ```bash
   node send-notification.js "Test" "Ceci est un test de notification push"
   ```
4. **Vérifiez** que la notification apparaît même si l'app est fermée

---

## 🔧 Dépannage

### La notification n'arrive pas
- ✅ Vérifiez que la table `fcm_tokens` existe dans Supabase
- ✅ Vérifiez qu'au moins un token est présent : `SELECT * FROM fcm_tokens`
- ✅ Vérifiez que l'app a bien les permissions de notification activées
- ✅ Vérifiez la clé FCM serveur dans `.env.server`

### Erreur "Unauthorized"
- La clé serveur Firebase est incorrecte
- Allez sur Firebase Console > Project Settings > Cloud Messaging
- Copiez la "Server key" (legacy)

### Token invalide
- Le token FCM peut expirer si l'app est désinstallée/réinstallée
- L'app met automatiquement à jour le token à chaque connexion

---

## 📱 Prochaines étapes

1. ✅ Tester l'envoi manuel de notifications
2. ⬜ Configurer un webhook Supabase pour automatiser
3. ⬜ Créer une interface admin pour envoyer des notifications personnalisées
4. ⬜ Ajouter des notifications pour d'autres événements (course acceptée, arrivée chauffeur, etc.)

---

**Questions ? Besoin d'aide ?**  
Consultez la documentation Firebase : https://firebase.google.com/docs/cloud-messaging
