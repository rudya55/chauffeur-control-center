import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const FIREBASE_SERVER_KEY = Deno.env.get("FIREBASE_SERVER_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  reservationId: string;
  driverId?: string;
  title?: string;
  body?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: NotificationPayload = await req.json();
    console.log('📨 Notification request received:', payload);

    if (!payload.reservationId) {
      throw new Error('reservationId est requis');
    }

    // Créer le client Supabase avec service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Récupérer les détails de la réservation
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', payload.reservationId)
      .single();

    if (reservationError || !reservation) {
      throw new Error('Réservation non trouvée');
    }

    console.log('📋 Reservation details:', {
      id: reservation.id,
      client_name: reservation.client_name,
      driver_id: reservation.driver_id,
      status: reservation.status
    });

    // Déterminer le chauffeur à notifier
    let targetDriverId = payload.driverId || reservation.driver_id;

    if (!targetDriverId) {
      console.log('⚠️ Aucun chauffeur assigné, notification à tous les chauffeurs');
      // Si aucun chauffeur assigné, notifier tous les chauffeurs actifs
      return await notifyAllDrivers(supabase, reservation, payload);
    }

    // Récupérer le token FCM du chauffeur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('fcm_token, full_name')
      .eq('id', targetDriverId)
      .single();

    if (profileError || !profile) {
      throw new Error('Profil du chauffeur non trouvé');
    }

    if (!profile.fcm_token) {
      console.log('⚠️ Chauffeur sans token FCM:', targetDriverId);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Le chauffeur n\'a pas activé les notifications' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Préparer le message de notification
    const notificationTitle = payload.title || '🚗 Nouvelle course disponible';
    const notificationBody = payload.body || 
      `${reservation.client_name} - ${reservation.pickup_address} → ${reservation.destination}`;

    // Envoyer la notification via Firebase Cloud Messaging
    const fcmResponse = await sendFCMNotification(
      profile.fcm_token,
      notificationTitle,
      notificationBody,
      {
        reservationId: reservation.id,
        clientName: reservation.client_name,
        pickup: reservation.pickup_address,
        destination: reservation.destination,
        amount: reservation.amount.toString(),
      }
    );

    console.log('✅ Notification envoyée avec succès');

    return new Response(
      JSON.stringify({ 
        success: true, 
        result: fcmResponse,
        driver: profile.full_name 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

async function notifyAllDrivers(supabase: any, reservation: any, payload: NotificationPayload) {
  // Récupérer tous les profils avec tokens FCM
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, fcm_token, full_name')
    .not('fcm_token', 'is', null);

  if (error || !profiles || profiles.length === 0) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Aucun chauffeur avec notifications activées' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  const notificationTitle = payload.title || '🚗 Nouvelle course disponible';
  const notificationBody = payload.body || 
    `${reservation.client_name} - ${reservation.pickup_address} → ${reservation.destination}`;

  // Envoyer à tous les chauffeurs
  const promises = profiles.map(profile => 
    sendFCMNotification(
      profile.fcm_token,
      notificationTitle,
      notificationBody,
      {
        reservationId: reservation.id,
        clientName: reservation.client_name,
        pickup: reservation.pickup_address,
        destination: reservation.destination,
        amount: reservation.amount.toString(),
      }
    )
  );

  const results = await Promise.allSettled(promises);
  const successCount = results.filter(r => r.status === 'fulfilled').length;

  console.log(`✅ ${successCount}/${profiles.length} notifications envoyées`);

  return new Response(
    JSON.stringify({ 
      success: true, 
      sent: successCount,
      total: profiles.length 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}

async function sendFCMNotification(
  fcmToken: string,
  title: string,
  body: string,
  data: Record<string, string>
) {
  if (!FIREBASE_SERVER_KEY) {
    throw new Error('FIREBASE_SERVER_KEY non configuré');
  }

  const message = {
    to: fcmToken,
    notification: {
      title: title,
      body: body,
      icon: '/icon-192x192.png',
      click_action: '/reservations',
    },
    data: data,
    priority: 'high',
  };

  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${FIREBASE_SERVER_KEY}`,
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FCM Error: ${errorText}`);
  }

  return await response.json();
}
