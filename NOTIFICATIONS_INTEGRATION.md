# 🔔 Intégration des Notifications Push - Guide Complet

## ✅ Système Installé

Votre application est maintenant équipée d'un système complet de notifications push qui permet aux chauffeurs de recevoir des alertes en temps réel lorsqu'une nouvelle course est créée ou assignée.

---

## 🎯 Fonctionnalités Implémentées

### 1. **Enregistrement automatique des tokens FCM**
- Demande automatique de permission après connexion
- Stockage sécurisé du token dans la table `profiles`
- Prompt élégant avec option "Plus tard"

### 2. **Notifications en temps réel**
- **Nouvelles réservations** : Alert instantanée quand une course est créée
- **Mises à jour de statut** : Notification quand le statut change (acceptée, en cours, terminée)
- **Badge de notification** : Compteur visuel dans l'interface
- **Son de notification** : Alerte sonore (si fichier audio disponible)

### 3. **Edge Function automatique**
- `notify-new-reservation` : Envoie automatiquement une notification push
- Supporte l'envoi à un chauffeur spécifique OU à tous les chauffeurs
- Utilise Firebase Cloud Messaging (FCM)

### 4. **Composants UI**
- **NotificationBell** : Cloche avec badge et liste déroulante
- **NotificationPermissionPrompt** : Prompt élégant pour demander la permission
- Écoute en temps réel des changements dans la base de données

---

## 📋 Configuration Requise

### Étape 1 : Configuration Firebase

Vous devez avoir un projet Firebase avec Cloud Messaging activé. Suivez le guide `FIREBASE_SETUP.md` si ce n'est pas déjà fait.

**Variables d'environnement nécessaires :**
```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_FIREBASE_VAPID_KEY=votre_cle_vapid_publique
```

### Étape 2 : Secret Backend (CRITIQUE)

**Vous DEVEZ ajouter la clé serveur Firebase comme secret backend :**

1. Allez dans Firebase Console > Project Settings > Cloud Messaging
2. Copiez la **Server Key**
3. Ajoutez-la comme secret Lovable Cloud :
   - Nom : `FIREBASE_SERVER_KEY`
   - Valeur : Votre clé serveur

**⚠️ Sans cette clé, les notifications ne pourront pas être envoyées !**

### Étape 3 : Fichier Service Worker

Le fichier `public/firebase-messaging-sw.js` est déjà créé. Assurez-vous qu'il contient vos vraies clés Firebase (pas les placeholders).

---

## 🚀 Utilisation

### Depuis l'application administrative

Lorsque vous créez ou assignez une réservation, vous pouvez envoyer une notification push :

```typescript
import { supabase } from '@/integrations/supabase/client';

// Après création d'une réservation
const { data: reservation } = await supabase
  .from('reservations')
  .insert({ /* ... */ })
  .select()
  .single();

// Envoyer notification au chauffeur assigné
if (reservation.driver_id) {
  await supabase.functions.invoke('notify-new-reservation', {
    body: {
      reservationId: reservation.id,
      driverId: reservation.driver_id,
    }
  });
}

// OU notifier TOUS les chauffeurs (course non assignée)
await supabase.functions.invoke('notify-new-reservation', {
  body: {
    reservationId: reservation.id,
    // Pas de driverId = notification à tous
  }
});
```

### Personnalisation du message

```typescript
await supabase.functions.invoke('notify-new-reservation', {
  body: {
    reservationId: reservation.id,
    driverId: driverId,
    title: '🎉 Course VIP disponible',
    body: 'Une course premium vous attend à l\'aéroport',
  }
});
```

---

## 📱 Fonctionnement Côté Chauffeur

### 1. **Première connexion**
- Un prompt élégant apparaît après 3 secondes
- Le chauffeur peut cliquer sur "Activer" ou "Plus tard"
- Si "Activer" : demande de permission du navigateur
- Le token FCM est automatiquement enregistré dans `profiles.fcm_token`

### 2. **Réception de notifications**

**Application ouverte (premier plan) :**
- Toast avec titre et description
- Son de notification (si disponible)
- Badge de notification s'incrémente
- Notification système du navigateur

**Application en arrière-plan :**
- Notification système du navigateur via Service Worker
- Badge visible même si l'app est fermée

### 3. **Cloche de notifications**
- Badge rouge avec le nombre de notifications non lues
- Clic sur la cloche : liste déroulante
- Clic sur une notification : redirection vers `/reservations` et suppression

---

## 🔧 Architecture Technique

### Base de données
```sql
-- Table profiles (déjà existante)
profiles.fcm_token: TEXT -- Stocke le token FCM du chauffeur

-- Vous pourriez aussi créer une table dédiée (optionnel)
fcm_tokens (user_id, token, device_info, created_at)
```

### Edge Functions

#### `notify-new-reservation`
- **Entrée** : `{ reservationId, driverId?, title?, body? }`
- **Sortie** : `{ success, result, driver? }`
- **Logique** :
  1. Récupère les détails de la réservation
  2. Si `driverId` fourni : envoie à ce chauffeur
  3. Sinon : envoie à TOUS les chauffeurs avec token FCM
  4. Utilise Firebase Cloud Messaging API

#### `send-notification` (existant)
- Fonction générique pour envoyer une notification à un token spécifique
- Utilisée par `notify-new-reservation`

### Fichiers Clés

```
src/
├── services/
│   ├── firebaseNotifications.ts       # Service principal
│   └── notificationService.ts         # Pour app mobile native (Capacitor)
├── components/
│   ├── NotificationBell.tsx           # Composant cloche avec badge
│   └── NotificationPermissionPrompt.tsx # Prompt d'activation
├── hooks/
│   └── use-firebase-messaging.tsx     # Hook React (alternatif)
└── integrations/
    └── firebase/
        └── config.ts                  # Configuration Firebase

supabase/functions/
├── notify-new-reservation/
│   └── index.ts                       # Edge function automatique
└── send-notification/
    └── index.ts                       # Edge function générique

public/
└── firebase-messaging-sw.js           # Service Worker
```

---

## 🎨 Personnalisation

### Changer le son de notification

Ajoutez un fichier audio dans `public/notification-sound.mp3` ou modifiez le chemin dans `firebaseNotifications.ts` :

```typescript
const audio = new Audio('/votre-son.mp3');
```

### Changer l'icône de notification

Modifiez l'icône dans `notify-new-reservation/index.ts` :

```typescript
notification: {
  icon: '/votre-icone.png',
  badge: '/votre-badge.png',
}
```

### Ajouter des actions aux notifications

Dans `firebase-messaging-sw.js` :

```javascript
self.registration.showNotification(notificationTitle, {
  body: notificationBody,
  icon: '/icon-192x192.png',
  actions: [
    { action: 'accept', title: 'Accepter' },
    { action: 'decline', title: 'Refuser' },
  ],
});
```

---

## 🧪 Tests

### Test manuel

1. **Vérifier l'enregistrement du token :**
   - Connectez-vous comme chauffeur
   - Acceptez les notifications
   - Vérifiez dans la base : `SELECT fcm_token FROM profiles WHERE id = 'votre_id'`

2. **Tester l'envoi depuis l'admin :**
   - Créez une nouvelle réservation avec un chauffeur assigné
   - Invoquez manuellement l'edge function :
   ```typescript
   await supabase.functions.invoke('notify-new-reservation', {
     body: { reservationId: 'xxx', driverId: 'yyy' }
   });
   ```
   - Le chauffeur devrait recevoir la notification

3. **Tester en temps réel :**
   - Ouvrez l'app chauffeur dans un navigateur
   - Ouvrez l'app admin dans un autre onglet
   - Créez une course → le chauffeur reçoit la notification instantanément

### Test avec cURL

```bash
curl -X POST https://votre-projet.supabase.co/functions/v1/notify-new-reservation \
  -H "Authorization: Bearer VOTRE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "reservationId": "uuid-de-la-reservation",
    "driverId": "uuid-du-chauffeur"
  }'
```

---

## 🐛 Dépannage

### Notifications non reçues

**1. Vérifier les permissions :**
```javascript
console.log(Notification.permission); // Doit être "granted"
```

**2. Vérifier le token FCM :**
```sql
SELECT id, full_name, fcm_token FROM profiles WHERE id = 'votre_id';
```
Le token doit être présent (longue chaîne de caractères).

**3. Vérifier le secret backend :**
```javascript
// Dans notify-new-reservation/index.ts
console.log('FIREBASE_SERVER_KEY:', FIREBASE_SERVER_KEY ? 'Configuré ✅' : 'MANQUANT ❌');
```

**4. Vérifier les logs de l'edge function :**
- Allez dans Lovable Cloud → Edge Functions → notify-new-reservation → Logs
- Recherchez les erreurs FCM

### Erreur "Messaging not supported"

- Vérifiez que vous êtes en HTTPS
- Vérifiez que `messaging` est bien initialisé dans `firebase/config.ts`
- Vérifiez que votre navigateur supporte les Service Workers

### Service Worker non enregistré

```javascript
// Dans la console navigateur
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
});
```

Doit afficher au moins un SW pour `/firebase-messaging-sw.js`.

---

## 📈 Améliorations Futures

1. **Historique des notifications** : Table dédiée pour garder un historique
2. **Préférences de notifications** : Permettre au chauffeur de choisir quelles notifications recevoir
3. **Notification groupées** : Grouper plusieurs courses non assignées
4. **Analytics** : Tracker le taux d'ouverture des notifications
5. **Rich notifications** : Ajouter des images et des actions (Accepter/Refuser)

---

## ✅ Checklist de Déploiement

- [ ] Variables d'environnement Firebase configurées (frontend)
- [ ] Secret `FIREBASE_SERVER_KEY` configuré (backend)
- [ ] Service Worker `firebase-messaging-sw.js` avec vraies clés
- [ ] Table `profiles.fcm_token` existe
- [ ] Edge function `notify-new-reservation` déployée
- [ ] Composant `NotificationBell` ajouté dans le layout
- [ ] Test d'envoi de notification réussi
- [ ] Notifications reçues en temps réel ✅

---

## 🎉 Résultat Final

Vos chauffeurs reçoivent maintenant des **notifications push instantanées** dès qu'une nouvelle course est créée ou assignée, que l'application soit ouverte ou en arrière-plan !

**Synchronisation parfaite entre l'application administrative et l'application chauffeur.**
