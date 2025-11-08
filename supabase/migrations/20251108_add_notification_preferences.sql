-- Ajoute les colonnes pour gérer les préférences de notifications
-- Date: 2025-11-08

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS push_notifications_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notification_sound text DEFAULT 'default';

-- Colonne utilitaire pour marquer qu'une réservation a déjà déclenché une notification (utilisée par le poller)
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS notified boolean DEFAULT false;
