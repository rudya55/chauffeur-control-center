-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  destination TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  phone TEXT NOT NULL,
  flight_number TEXT,
  dispatcher TEXT NOT NULL,
  dispatcher_logo TEXT,
  passengers INTEGER NOT NULL DEFAULT 1,
  luggage INTEGER NOT NULL DEFAULT 0,
  amount DECIMAL(10,2) NOT NULL,
  driver_amount DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2) NOT NULL,
  vehicle_type TEXT NOT NULL,
  payment_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  driver_id UUID REFERENCES public.profiles(id),
  actual_pickup_time TIMESTAMP WITH TIME ZONE,
  dropoff_time TIMESTAMP WITH TIME ZONE,
  distance TEXT,
  duration TEXT,
  rating INTEGER,
  comment TEXT,
  route JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can view all reservations
CREATE POLICY "Authenticated users can view all reservations" 
ON public.reservations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can create reservations
CREATE POLICY "Authenticated users can create reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can update reservations
CREATE POLICY "Authenticated users can update reservations" 
ON public.reservations 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can delete reservations
CREATE POLICY "Authenticated users can delete reservations" 
ON public.reservations 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for reservations table
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;