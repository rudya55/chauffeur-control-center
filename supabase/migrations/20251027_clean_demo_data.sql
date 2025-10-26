-- ============================================
-- NETTOYAGE COMPLET DES DONNÉES DE DÉMONSTRATION
-- Exécutez ce script dans le SQL Editor de Supabase
-- ============================================

-- 1. Supprimer toutes les réservations
TRUNCATE TABLE public.reservations CASCADE;

-- 2. Supprimer toutes les transactions comptables
TRUNCATE TABLE public.accounting_transactions CASCADE;

-- 3. Supprimer toutes les zones géographiques
TRUNCATE TABLE public.geographic_zones CASCADE;

-- 4. Supprimer toutes les règles de tarification
TRUNCATE TABLE public.pricing_rules CASCADE;

-- 5. Supprimer tous les forfaits aéroport
TRUNCATE TABLE public.airport_packages CASCADE;

-- 6. Supprimer tous les documents de démonstration
TRUNCATE TABLE public.driver_documents CASCADE;

-- 7. Supprimer tous les tokens FCM (seront recréés automatiquement)
TRUNCATE TABLE public.fcm_tokens CASCADE;

-- ============================================
-- TABLES CONSERVÉES (vos vraies données) :
-- - profiles : Vos comptes utilisateurs
-- - user_roles : Vos rôles admin/chauffeur
-- - auth.users : Votre authentification
-- ============================================

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Base de données nettoyée avec succès !';
  RAISE NOTICE '📊 Toutes les données de démonstration ont été supprimées.';
  RAISE NOTICE '👤 Vos comptes utilisateurs et rôles sont conservés.';
  RAISE NOTICE '🔔 Les tokens FCM seront recréés à la prochaine connexion.';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Votre application est maintenant prête pour les données réelles !';
END $$;
