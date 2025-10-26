import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // SQL Migration for FCM tokens table
    const migrationSQL = `
      -- Create FCM Tokens Table
      CREATE TABLE IF NOT EXISTS public.fcm_tokens (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
        UNIQUE(user_id)
      );

      -- Index for fast lookup by user_id
      CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON public.fcm_tokens(user_id);

      -- Enable RLS
      ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

      -- RLS Policies
      DROP POLICY IF EXISTS "Users can view their own FCM token" ON public.fcm_tokens;
      CREATE POLICY "Users can view their own FCM token"
        ON public.fcm_tokens
        FOR SELECT
        USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can insert their own FCM token" ON public.fcm_tokens;
      CREATE POLICY "Users can insert their own FCM token"
        ON public.fcm_tokens
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can update their own FCM token" ON public.fcm_tokens;
      CREATE POLICY "Users can update their own FCM token"
        ON public.fcm_tokens
        FOR UPDATE
        USING (auth.uid() = user_id);

      -- Create or replace the updated_at trigger function
      CREATE OR REPLACE FUNCTION public.handle_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Create trigger for auto-updating updated_at
      DROP TRIGGER IF EXISTS set_fcm_tokens_updated_at ON public.fcm_tokens;
      CREATE TRIGGER set_fcm_tokens_updated_at
        BEFORE UPDATE ON public.fcm_tokens
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_updated_at();
    `;

    // Execute the migration using rpc call
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      console.error('Migration error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          details: 'La migration n\'a pas pu être appliquée via RPC. Utilisez le SQL Editor.'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Migration FCM tokens appliquée avec succès !',
        data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (err) {
    console.error('Function error:', err);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: err.message,
        sql: migrationSQL 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});