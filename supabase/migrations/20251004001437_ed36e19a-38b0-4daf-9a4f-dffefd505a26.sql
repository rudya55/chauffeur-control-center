-- Add DELETE policies for profiles table
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

CREATE POLICY "Admins can delete any profile"
ON public.profiles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policies for driver_documents table
CREATE POLICY "Users can delete their own documents"
ON public.driver_documents
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any document"
ON public.driver_documents
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add UPDATE policy for user_roles table
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policies based on user approval status
-- Only approved drivers can view and manage reservations
CREATE POLICY "Only approved users can access driver features"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id 
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR (status = 'approved' AND auth.uid() = id)
);

-- Ensure only verified documents are accessible for operations
CREATE POLICY "Users can only use verified documents"
ON public.driver_documents
FOR SELECT
USING (
  (auth.uid() = user_id AND status = 'approved')
  OR public.has_role(auth.uid(), 'admin'::app_role)
);