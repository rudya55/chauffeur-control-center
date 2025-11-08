-- Migration ajoutant les préférences de notification au profil
-- Exécutez ce script dans votre base Supabase (SQL editor)

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS push_notifications_enabled boolean DEFAULT true;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_sound text DEFAULT 'default';

-- Optionnel : créer une table fcm_tokens si vous préférez stocker plusieurs tokens par utilisateur
-- Voir MIGRATION_FCM_TOKENS.sql fourni dans le repo.
