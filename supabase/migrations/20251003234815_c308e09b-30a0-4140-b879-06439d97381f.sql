-- Add status to profiles
ALTER TABLE public.profiles 
ADD COLUMN status text default 'pending' check (status in ('pending', 'approved', 'rejected'));

-- Create driver_documents table
CREATE TABLE public.driver_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  document_type text not null check (document_type in ('drivers_license', 'vehicle_insurance', 'vehicle_registration', 'other')),
  document_name text not null,
  document_url text not null,
  uploaded_at timestamp with time zone default now() not null,
  verified_at timestamp with time zone,
  verified_by uuid references auth.users(id),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text
);

-- Enable RLS on driver_documents
ALTER TABLE public.driver_documents ENABLE ROW LEVEL SECURITY;

-- Policies for driver_documents
CREATE POLICY "Users can view their own documents"
  ON public.driver_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own documents"
  ON public.driver_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents"
  ON public.driver_documents FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update documents"
  ON public.driver_documents FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Update profiles table policies to allow admins to update
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));