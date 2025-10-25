import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FIREBASE_SERVER_KEY = Deno.env.get("FIREBASE_SERVER_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { fcmToken, title, body, data } = await req.json();

    if (!fcmToken) {
      throw new Error('FCM token manquant');
    }

    const message = {
      to: fcmToken,
      notification: {
        title: title || 'Nouvelle course disponible',
        body: body || 'Une nouvelle réservation vous attend',
        icon: '/icon-192x192.png',
        click_action: data?.url || '/reservations',
      },
      data: data || {},
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

    const result = await response.json();

    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
