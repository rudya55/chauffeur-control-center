-- ========================================
-- FIX CRITICAL RLS SECURITY VULNERABILITIES
-- ========================================
-- Cette migration corrige les policies trop permissives qui permettaient
-- à tous les utilisateurs authentifiés de voir toutes les données

-- ========================================
-- 1. FIX RESERVATIONS RLS POLICIES
-- ========================================

-- Drop les anciennes policies trop permissives
DROP POLICY IF EXISTS "Authenticated users can view all reservations" ON public.reservations;
DROP POLICY IF EXISTS "Authenticated users can create reservations" ON public.reservations;
DROP POLICY IF EXISTS "Authenticated users can update reservations" ON public.reservations;
DROP POLICY IF EXISTS "Authenticated users can delete reservations" ON public.reservations;

-- Policy SELECT: Admins voient tout, drivers voient seulement leurs réservations
CREATE POLICY "Users can view reservations based on role"
ON public.reservations
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR driver_id = auth.uid()
);

-- Policy INSERT: Seulement les admins peuvent créer des réservations
CREATE POLICY "Only admins can create reservations"
ON public.reservations
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy UPDATE: Admins peuvent tout modifier, drivers peuvent seulement modifier leurs propres réservations
CREATE POLICY "Users can update reservations based on role"
ON public.reservations
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR driver_id = auth.uid()
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR driver_id = auth.uid()
);

-- Policy DELETE: Seulement les admins peuvent supprimer
CREATE POLICY "Only admins can delete reservations"
ON public.reservations
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ========================================
-- 2. FIX ACCOUNTING TRANSACTIONS RLS POLICIES
-- ========================================

-- Drop les anciennes policies trop permissives
DROP POLICY IF EXISTS "Authenticated users can view accounting transactions" ON public.accounting_transactions;
DROP POLICY IF EXISTS "Authenticated users can create accounting transactions" ON public.accounting_transactions;
DROP POLICY IF EXISTS "Authenticated users can update accounting transactions" ON public.accounting_transactions;

-- Policy SELECT: Admins voient tout, drivers voient seulement les transactions liées à leurs réservations
CREATE POLICY "Users can view accounting transactions based on role"
ON public.accounting_transactions
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.reservations r
    WHERE r.id = accounting_transactions.reservation_id
    AND r.driver_id = auth.uid()
  )
);

-- Policy INSERT: Seulement les admins (les transactions automatiques utilisent SECURITY DEFINER)
CREATE POLICY "Only admins can manually create accounting transactions"
ON public.accounting_transactions
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy UPDATE: Seulement les admins peuvent modifier
CREATE POLICY "Only admins can update accounting transactions"
ON public.accounting_transactions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy DELETE: Seulement les admins peuvent supprimer
CREATE POLICY "Only admins can delete accounting transactions"
ON public.accounting_transactions
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ========================================
-- 3. FIX PROFILES RLS POLICIES
-- ========================================

-- Ajouter une policy pour que les admins puissent voir tous les profils
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Ajouter une policy pour que les admins puissent modifier tous les profils
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ========================================
-- COMMENTAIRES DE SÉCURITÉ
-- ========================================

COMMENT ON POLICY "Users can view reservations based on role" ON public.reservations IS
'Admins voient toutes les réservations, drivers seulement les leurs (driver_id = auth.uid())';

COMMENT ON POLICY "Users can view accounting transactions based on role" ON public.accounting_transactions IS
'Admins voient toutes les transactions, drivers seulement celles liées à leurs réservations';
