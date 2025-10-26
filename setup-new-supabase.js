#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Nouvelles informations Supabase
const supabaseUrl = 'https://nulrmprnorszvsdenxqa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51bHJtcHJub3JzenZzZGVueHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTYwOTMsImV4cCI6MjA1MDgzMjA5M30.mFzZS1sInJlZjI6Im51bHJtcHJub3JzenZzZGVueHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTYwOTMsImV4cCI6MjA1MDgzMjA5M30.DIsmV4cCI6MjA3ZXKGkq2SB2F0HM7NdFQNjWTwsTYZf9Z70dFQyHDAwc';

console.log('🔄 Test de connexion au nouveau projet Supabase...');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test de connexion
try {
  const { data, error } = await supabase
    .from('non_existent_table')
    .select('*')
    .limit(1);
  
  if (error && error.code === 'PGRST116') {
    console.log('✅ Connexion Supabase réussie !');
    console.log('📋 Le nouveau projet est prêt pour la migration');
  } else {
    console.log('⚠️  Réponse inattendue:', error || data);
  }
  
} catch (err) {
  console.log('❌ Erreur de connexion:', err.message);
}

console.log('\n🔗 Dashboard Supabase:');
console.log(`   https://supabase.com/dashboard/project/nulrmprnorszvsdenxqa`);
console.log('\n🔗 SQL Editor:');
console.log(`   https://supabase.com/dashboard/project/nulrmprnorszvsdenxqa/sql/new`);

console.log('\n📋 SQL de migration à appliquer:');
console.log('=====================================');

const migrationSQL = `
-- Créer la table fcm_tokens pour les notifications
CREATE TABLE IF NOT EXISTS public.fcm_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Index et permissions
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON public.fcm_tokens(user_id);
ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

-- Policies de sécurité
CREATE POLICY "Users can view their own FCM token" ON public.fcm_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own FCM token" ON public.fcm_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own FCM token" ON public.fcm_tokens FOR UPDATE USING (auth.uid() = user_id);

-- Fonction pour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at() RETURNS TRIGGER AS $$
BEGIN 
    NEW.updated_at = NOW(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

-- Trigger automatique
CREATE TRIGGER set_fcm_tokens_updated_at BEFORE UPDATE ON public.fcm_tokens FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
`;

console.log(migrationSQL);
console.log('=====================================');