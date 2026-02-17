
-- Add is_blocked column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_blocked boolean NOT NULL DEFAULT false;

-- Allow admins to update all profiles (for blocking)
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete user roles
CREATE POLICY "Admins can delete user roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete medicines
CREATE POLICY "Admins can delete all medicines"
ON public.medicines FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete medicine logs
CREATE POLICY "Admins can delete all logs"
ON public.medicine_logs FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
