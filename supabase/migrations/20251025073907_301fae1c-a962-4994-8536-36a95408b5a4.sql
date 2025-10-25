-- Ajouter la colonne fcm_token pour stocker les tokens Firebase Cloud Messaging
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fcm_token TEXT;

-- Créer un index pour améliorer les performances de recherche par token
CREATE INDEX IF NOT EXISTS idx_profiles_fcm_token ON profiles(fcm_token);

COMMENT ON COLUMN profiles.fcm_token IS 'Token Firebase Cloud Messaging pour les notifications push';