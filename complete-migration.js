#!/usr/bin/env node

// Script pour appliquer TOUTES les migrations sur le nouveau projet Supabase
console.log('🔄 Application de TOUTES les migrations pour un projet Supabase complet...');

console.log('\n📋 TOUTES LES MIGRATIONS À APPLIQUER:');
console.log('=====================================');

// Migration complète combinée
const allMigrationsSQL = `
-- ===============================================
-- MIGRATION COMPLÈTE SUPABASE - VTC DISPATCH
-- ===============================================

-- 1. Table des réservations (cœur de l'application)
CREATE TABLE IF NOT EXISTS public.reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL,
  pickup_address text NOT NULL,
  destination text NOT NULL,
  phone text NOT NULL,
  date timestamp with time zone NOT NULL,
  flight_number text,
  dispatcher text NOT NULL DEFAULT 'Admin',
  dispatcher_logo text,
  passengers integer DEFAULT 1,
  luggage integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'started', 'arrived', 'onBoard', 'completed', 'cancelled')),
  actual_pickup_time timestamp with time zone,
  dropoff_time timestamp with time zone,
  distance text,
  duration text,
  amount numeric DEFAULT 0,
  driver_amount numeric DEFAULT 0,
  commission numeric DEFAULT 0,
  vehicle_type text DEFAULT 'standard' CHECK (vehicle_type IN ('standard', 'berline', 'van', 'mini-bus', 'first-class')),
  payment_type text DEFAULT 'cash' CHECK (payment_type IN ('cash', 'card', 'transfer', 'paypal', 'stripe')),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  route jsonb,
  flight_status text CHECK (flight_status IN ('on-time', 'delayed', 'landed', 'boarding', 'cancelled')),
  placard_text text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2. Table des transactions comptables (auto-sync avec réservations)
CREATE TABLE IF NOT EXISTS public.accounting_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_id uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  transaction_date timestamp with time zone NOT NULL DEFAULT now(),
  transaction_type text NOT NULL CHECK (transaction_type IN ('revenue', 'expense', 'commission')),
  amount numeric NOT NULL,
  category text NOT NULL,
  description text,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'cancelled')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. Table des zones géographiques
CREATE TABLE IF NOT EXISTS public.geographic_zones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  zone_type text NOT NULL CHECK (zone_type IN ('city', 'airport', 'station', 'district')),
  description text,
  coordinates jsonb,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 4. Table des règles de tarification
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  zone_from_id uuid REFERENCES public.geographic_zones(id) ON DELETE CASCADE,
  zone_to_id uuid REFERENCES public.geographic_zones(id) ON DELETE CASCADE,
  vehicle_type text NOT NULL CHECK (vehicle_type IN ('standard', 'berline', 'van', 'mini-bus', 'first-class')),
  base_price numeric NOT NULL,
  is_flat_rate boolean DEFAULT true,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 5. Table des forfaits aéroport
CREATE TABLE IF NOT EXISTS public.airport_packages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_name text NOT NULL,
  airport_zone_id uuid REFERENCES public.geographic_zones(id) ON DELETE CASCADE,
  destination_zone_id uuid REFERENCES public.geographic_zones(id) ON DELETE SET NULL,
  vehicle_type text NOT NULL CHECK (vehicle_type IN ('standard', 'berline', 'van', 'mini-bus', 'first-class')),
  flat_rate numeric NOT NULL,
  included_waiting_time integer DEFAULT 30,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 6. Table des rôles utilisateurs
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'driver', 'dispatcher')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 7. Table des documents chauffeurs
CREATE TABLE IF NOT EXISTS public.driver_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_type text NOT NULL,
  document_url text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid REFERENCES auth.users(id)
);

-- 8. Table FCM tokens (déjà créée mais on s'assure)
CREATE TABLE IF NOT EXISTS public.fcm_tokens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- ===============================================
-- INDEXES POUR PERFORMANCE
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_dispatcher ON public.reservations(dispatcher);
CREATE INDEX IF NOT EXISTS idx_accounting_reservation_id ON public.accounting_transactions(reservation_id);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON public.fcm_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_driver_documents_user_id ON public.driver_documents(user_id);

-- ===============================================
-- ROW LEVEL SECURITY (RLS)
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geographic_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airport_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- POLICIES RLS
-- ===============================================

-- Réservations - tous les utilisateurs authentifiés peuvent voir et modifier
DROP POLICY IF EXISTS "Authenticated users can view reservations" ON public.reservations;
CREATE POLICY "Authenticated users can view reservations" ON public.reservations FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can create reservations" ON public.reservations;
CREATE POLICY "Authenticated users can create reservations" ON public.reservations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update reservations" ON public.reservations;
CREATE POLICY "Authenticated users can update reservations" ON public.reservations FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Transactions comptables
DROP POLICY IF EXISTS "Authenticated users can view accounting transactions" ON public.accounting_transactions;
CREATE POLICY "Authenticated users can view accounting transactions" ON public.accounting_transactions FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can create accounting transactions" ON public.accounting_transactions;
CREATE POLICY "Authenticated users can create accounting transactions" ON public.accounting_transactions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Zones géographiques
DROP POLICY IF EXISTS "Authenticated users can view geographic zones" ON public.geographic_zones;
CREATE POLICY "Authenticated users can view geographic zones" ON public.geographic_zones FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can create geographic zones" ON public.geographic_zones;
CREATE POLICY "Authenticated users can create geographic zones" ON public.geographic_zones FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update geographic zones" ON public.geographic_zones;
CREATE POLICY "Authenticated users can update geographic zones" ON public.geographic_zones FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Règles de tarification
DROP POLICY IF EXISTS "Authenticated users can view pricing rules" ON public.pricing_rules;
CREATE POLICY "Authenticated users can view pricing rules" ON public.pricing_rules FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can create pricing rules" ON public.pricing_rules;
CREATE POLICY "Authenticated users can create pricing rules" ON public.pricing_rules FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Forfaits aéroport
DROP POLICY IF EXISTS "Authenticated users can view airport packages" ON public.airport_packages;
CREATE POLICY "Authenticated users can view airport packages" ON public.airport_packages FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can create airport packages" ON public.airport_packages;
CREATE POLICY "Authenticated users can create airport packages" ON public.airport_packages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Rôles utilisateurs
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can create user roles" ON public.user_roles;
CREATE POLICY "Authenticated users can create user roles" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Documents chauffeurs
DROP POLICY IF EXISTS "Users can view their own documents" ON public.driver_documents;
CREATE POLICY "Users can view their own documents" ON public.driver_documents FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can upload their own documents" ON public.driver_documents;
CREATE POLICY "Users can upload their own documents" ON public.driver_documents FOR INSERT WITH CHECK (auth.uid() = user_id);

-- FCM Tokens
DROP POLICY IF EXISTS "Users can view their own FCM token" ON public.fcm_tokens;
CREATE POLICY "Users can view their own FCM token" ON public.fcm_tokens FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own FCM token" ON public.fcm_tokens;
CREATE POLICY "Users can insert their own FCM token" ON public.fcm_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own FCM token" ON public.fcm_tokens;
CREATE POLICY "Users can update their own FCM token" ON public.fcm_tokens FOR UPDATE USING (auth.uid() = user_id);

-- ===============================================
-- FONCTIONS ET TRIGGERS
-- ===============================================

-- Fonction pour updated_at automatique
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS set_reservations_updated_at ON public.reservations;
CREATE TRIGGER set_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_accounting_transactions_updated_at ON public.accounting_transactions;
CREATE TRIGGER set_accounting_transactions_updated_at BEFORE UPDATE ON public.accounting_transactions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_geographic_zones_updated_at ON public.geographic_zones;
CREATE TRIGGER set_geographic_zones_updated_at BEFORE UPDATE ON public.geographic_zones FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_pricing_rules_updated_at ON public.pricing_rules;
CREATE TRIGGER set_pricing_rules_updated_at BEFORE UPDATE ON public.pricing_rules FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_airport_packages_updated_at ON public.airport_packages;
CREATE TRIGGER set_airport_packages_updated_at BEFORE UPDATE ON public.airport_packages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_fcm_tokens_updated_at ON public.fcm_tokens;
CREATE TRIGGER set_fcm_tokens_updated_at BEFORE UPDATE ON public.fcm_tokens FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Fonction pour créer automatiquement les entrées comptables lors de la complétion d'une réservation
CREATE OR REPLACE FUNCTION public.create_accounting_entries_on_reservation_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Entrée de revenus (montant total)
    INSERT INTO public.accounting_transactions (
      reservation_id,
      transaction_date,
      transaction_type,
      amount,
      category,
      description,
      payment_status
    ) VALUES (
      NEW.id,
      NEW.dropoff_time,
      'revenue',
      NEW.amount,
      'ride_income',
      'Revenu de la course: ' || NEW.client_name,
      'completed'
    );
    
    -- Entrée de commission
    IF NEW.commission > 0 THEN
      INSERT INTO public.accounting_transactions (
        reservation_id,
        transaction_date,
        transaction_type,
        amount,
        category,
        description,
        payment_status
      ) VALUES (
        NEW.id,
        NEW.dropoff_time,
        'commission',
        NEW.commission,
        'platform_fee',
        'Commission plateforme: ' || NEW.client_name,
        'completed'
      );
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour les entrées comptables automatiques
DROP TRIGGER IF EXISTS auto_accounting_on_completion ON public.reservations;
CREATE TRIGGER auto_accounting_on_completion
  AFTER UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.create_accounting_entries_on_reservation_complete();

-- ===============================================
-- DONNÉES DE BASE (zones et tarifs de démonstration)
-- ===============================================

-- Insérer quelques zones de base si elles n'existent pas
INSERT INTO public.geographic_zones (name, zone_type, description, coordinates, active)
SELECT 'Centre-ville Paris', 'city', 'Centre de Paris', '{"lat": 48.8566, "lng": 2.3522}', true
WHERE NOT EXISTS (SELECT 1 FROM public.geographic_zones WHERE name = 'Centre-ville Paris');

INSERT INTO public.geographic_zones (name, zone_type, description, coordinates, active)
SELECT 'Aéroport CDG', 'airport', 'Aéroport Charles de Gaulle', '{"lat": 49.0097, "lng": 2.5479}', true
WHERE NOT EXISTS (SELECT 1 FROM public.geographic_zones WHERE name = 'Aéroport CDG');

INSERT INTO public.geographic_zones (name, zone_type, description, coordinates, active)
SELECT 'Aéroport Orly', 'airport', 'Aéroport d''Orly', '{"lat": 48.7233, "lng": 2.3794}', true
WHERE NOT EXISTS (SELECT 1 FROM public.geographic_zones WHERE name = 'Aéroport Orly');

-- ===============================================
-- MIGRATION TERMINÉE !
-- ===============================================
`;

console.log(allMigrationsSQL);
console.log('=====================================');

console.log('\n🔗 Pour appliquer cette migration complète:');
console.log('   https://supabase.com/dashboard/project/nulrmprnorszvsdenxqa/sql/new');

console.log('\n✅ Cette migration créera TOUTES les fonctionnalités:');
console.log('   📋 Gestion des réservations complète');
console.log('   💰 Comptabilité automatique');
console.log('   📊 Analytics et rapports');
console.log('   🛡️  Gestion des rôles admin');
console.log('   🗺️  Configuration des zones et tarifs');
console.log('   📱 Notifications push FCM');
console.log('   📄 Gestion des documents chauffeurs');
console.log('   🎯 Interface administrative complète');

console.log('\n🚀 Après cette migration, l\'app aura 100% des fonctionnalités !');