-- Create accounting transactions table that auto-syncs with reservations
CREATE TABLE public.accounting_transactions (
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

-- Enable RLS
ALTER TABLE public.accounting_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view accounting transactions"
ON public.accounting_transactions
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create accounting transactions"
ON public.accounting_transactions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update accounting transactions"
ON public.accounting_transactions
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Function to automatically create accounting entries when reservation is completed
CREATE OR REPLACE FUNCTION public.create_accounting_entries_on_reservation_complete()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if status changed to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Create revenue entry (total amount)
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
      'Revenus de la course: ' || NEW.client_name || ' (' || NEW.pickup_address || ' → ' || NEW.destination || ')',
      'completed'
    );
    
    -- Create commission entry (commission amount)
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
      'platform_commission',
      'Commission plateforme: ' || NEW.client_name,
      'completed'
    );
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create accounting entries
CREATE TRIGGER on_reservation_completed
  AFTER UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.create_accounting_entries_on_reservation_complete();

-- Add updated_at trigger
CREATE TRIGGER update_accounting_transactions_updated_at
  BEFORE UPDATE ON public.accounting_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for accounting transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.accounting_transactions;