-- Ajouter les colonnes de position GPS à la table profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS last_location_update timestamp with time zone;

-- Créer un index pour améliorer les performances des requêtes de localisation
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Commentaires pour documenter les colonnes
COMMENT ON COLUMN public.profiles.latitude IS 'Latitude de la position actuelle du chauffeur';
COMMENT ON COLUMN public.profiles.longitude IS 'Longitude de la position actuelle du chauffeur';
COMMENT ON COLUMN public.profiles.last_location_update IS 'Dernière mise à jour de la position GPS';