-- Create table for geographic zones
CREATE TABLE public.geographic_zones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  zone_type text NOT NULL, -- 'city', 'airport', 'station', etc.
  coordinates jsonb NOT NULL, -- GeoJSON polygon or point
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for pricing rules
CREATE TABLE public.pricing_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  zone_from_id uuid REFERENCES public.geographic_zones(id) ON DELETE CASCADE,
  zone_to_id uuid REFERENCES public.geographic_zones(id) ON DELETE CASCADE,
  vehicle_type text NOT NULL,
  base_price numeric NOT NULL,
  price_per_km numeric,
  price_per_minute numeric,
  is_flat_rate boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for airport packages
CREATE TABLE public.airport_packages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  airport_zone_id uuid REFERENCES public.geographic_zones(id) ON DELETE CASCADE NOT NULL,
  destination_zone_id uuid REFERENCES public.geographic_zones(id) ON DELETE CASCADE,
  vehicle_type text NOT NULL,
  package_name text NOT NULL,
  flat_rate numeric NOT NULL,
  included_waiting_time integer DEFAULT 0, -- minutes
  extra_waiting_price numeric DEFAULT 0,
  description text,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.geographic_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airport_packages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for geographic_zones
CREATE POLICY "Everyone can view geographic zones"
ON public.geographic_zones FOR SELECT
USING (true);

CREATE POLICY "Admins can manage geographic zones"
ON public.geographic_zones FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for pricing_rules
CREATE POLICY "Everyone can view active pricing rules"
ON public.pricing_rules FOR SELECT
USING (active = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage pricing rules"
ON public.pricing_rules FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for airport_packages
CREATE POLICY "Everyone can view active airport packages"
ON public.airport_packages FOR SELECT
USING (active = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage airport packages"
ON public.airport_packages FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_geographic_zones_updated_at
BEFORE UPDATE ON public.geographic_zones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at
BEFORE UPDATE ON public.pricing_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_airport_packages_updated_at
BEFORE UPDATE ON public.airport_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();