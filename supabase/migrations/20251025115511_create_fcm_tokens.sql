-- ========================================
-- MIGRATION: Create FCM Tokens Table
-- ========================================
-- Table pour stocker les tokens FCM des utilisateurs pour les notifications push

-- Table fcm_tokens
CREATE TABLE IF NOT EXISTS public.fcm_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Index pour recherche rapide par user_id
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON public.fcm_tokens(user_id);

-- Enable RLS
ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Les utilisateurs peuvent voir et mettre à jour leur propre token
CREATE POLICY "Users can view their own FCM token"
    ON public.fcm_tokens
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own FCM token"
    ON public.fcm_tokens
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own FCM token"
    ON public.fcm_tokens
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER set_fcm_tokens_updated_at
    BEFORE UPDATE ON public.fcm_tokens
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Note: handle_updated_at() devrait déjà exister depuis d'autres migrations
-- Si pas, la créer:
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
