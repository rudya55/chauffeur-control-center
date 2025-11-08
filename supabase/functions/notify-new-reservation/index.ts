// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const FIREBASE_SERVICE_ACCOUNT_JSON = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON");
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

// Get OAuth2 access token from service account
async function getAccessToken() {
  if (!FIREBASE_SERVICE_ACCOUNT_JSON) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON non configuré');
  }

  const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_JSON);
  
  const jwtHeader = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const jwtClaimSet = btoa(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }));

  const signatureInput = `${jwtHeader}.${jwtClaimSet}`;
  
  // Import private key
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(serviceAccount.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Sign JWT
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(signatureInput)
  );

  const jwt = `${signatureInput}.${btoa(String.fromCharCode(...new Uint8Array(signature)))}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function sendFCMNotification(
  fcmToken: string,
  title: string,
  body: string,
  data: Record<string, string>
) {
  if (!FIREBASE_SERVICE_ACCOUNT_JSON) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON non configuré');
  }

  const accessToken = await getAccessToken();
  const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_JSON);
  
  const message = {
    message: {
      token: fcmToken,
      notification: {
        title: title,
        body: body,
      },
      data: data,
      android: {
        notification: {
          channel_id: "rides_channel",
          sound: "notification_sound" // correspond au nom dans res/raw (sans extension)
        }
      },
      apns: {
        payload: {
          aps: {
            sound: "notification_sound.caf"
          }
        }
      },
      webpush: {
        fcm_options: {
          link: '/reservations',
        },
        notification: {
          icon: '/icon-192x192.png',
        },
      },
    },
  };

  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(message),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FCM Error: ${errorText}`);
  }

  return await response.json();
}
