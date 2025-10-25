/**
 * Script d'envoi de notifications push Firebase Cloud Messaging
 * 
 * Utilisation:
 *   node send-notification.js "Titre" "Message" [userId]
 * 
 * Exemples:
 *   node send-notification.js "Nouvelle course" "Départ: CDG, Destination: Paris"
 *   node send-notification.js "Alerte" "Modification de réservation" user-uuid-123
 */

require('dotenv').config({ path: '.env.server' });
const { createClient } = require('@supabase/supabase-js');

const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!FCM_SERVER_KEY) {
  console.error('❌ FCM_SERVER_KEY manquante dans .env.server');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('⚠️  SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquante');
  console.error('   Notifications envoyées uniquement si tokens fournis manuellement');
}

const supabase = SUPABASE_URL && SUPABASE_SERVICE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;

/**
 * Envoyer une notification FCM à un token spécifique
 */
async function sendFCMNotification(token, title, body) {
  const message = {
    to: token,
    notification: {
      title: title,
      body: body,
      icon: 'ic_launcher',
      sound: 'default',
      color: '#1e3a8a'
    },
    data: {
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
      route: '/reservations'
    }
  };

  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FCM_SERVER_KEY}`
      },
      body: JSON.stringify(message)
    });

    const result = await response.json();
    
    if (result.success === 1) {
      console.log(`✅ Notification envoyée avec succès au token: ${token.substring(0, 20)}...`);
      return true;
    } else {
      console.error(`❌ Échec envoi notification:`, result);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi:`, error.message);
    return false;
  }
}

/**
 * Récupérer tous les tokens FCM depuis Supabase
 */
async function getAllTokens(userId = null) {
  if (!supabase) {
    console.warn('⚠️  Supabase non configuré, impossible de récupérer les tokens');
    return [];
  }

  try {
    let query = supabase.from('fcm_tokens').select('token, user_id');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Erreur récupération tokens:', error.message);
      return [];
    }

    console.log(`📱 ${data.length} token(s) FCM récupéré(s)`);
    return data.map(row => row.token);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return [];
  }
}

/**
 * Envoyer une notification à tous les chauffeurs ou à un utilisateur spécifique
 */
async function sendNotificationToAll(title, body, userId = null) {
  console.log(`\n📤 Envoi de notification...`);
  console.log(`   Titre: ${title}`);
  console.log(`   Message: ${body}`);
  if (userId) {
    console.log(`   Destinataire: ${userId}`);
  }

  const tokens = await getAllTokens(userId);

  if (tokens.length === 0) {
    console.error('❌ Aucun token trouvé. Assurez-vous que:');
    console.error('   1. La migration Supabase a été exécutée (table fcm_tokens)');
    console.error('   2. Au moins un utilisateur s\'est connecté via l\'app Android');
    console.error('   3. SUPABASE_SERVICE_ROLE_KEY est correcte dans .env.server');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const token of tokens) {
    const success = await sendFCMNotification(token, title, body);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    // Pause pour éviter de surcharger l'API FCM
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Résultat: ${successCount} envoyé(s), ${failCount} échec(s)`);
}

// Point d'entrée CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
Usage: node send-notification.js <titre> <message> [userId]

Exemples:
  node send-notification.js "Nouvelle course" "Départ: Aéroport CDG"
  node send-notification.js "Alerte" "Course annulée" abc-123-def

Options:
  titre     : Titre de la notification (obligatoire)
  message   : Corps de la notification (obligatoire)
  userId    : UUID de l'utilisateur cible (optionnel, si omis: envoi à tous)
    `);
    process.exit(1);
  }

  const [title, body, userId] = args;
  
  sendNotificationToAll(title, body, userId)
    .then(() => {
      console.log('\n✅ Terminé');
      process.exit(0);
    })
    .catch(err => {
      console.error('\n❌ Erreur fatale:', err);
      process.exit(1);
    });
}

module.exports = { sendFCMNotification, getAllTokens, sendNotificationToAll };
