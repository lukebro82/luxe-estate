-- Enable RLS on properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user has a given role
CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = required_role
  );
$$;

-- Helper function to check if user is admin or agent
CREATE OR REPLACE FUNCTION public.is_admin_or_agent()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'agent')
  );
$$;

-- Drop existing policies if any
DROP POLICY IF EXISTS "properties_select_public"  ON properties;
DROP POLICY IF EXISTS "properties_insert_staff"   ON properties;
DROP POLICY IF EXISTS "properties_update_staff"   ON properties;
DROP POLICY IF EXISTS "properties_delete_staff"   ON properties;

-- SELECT: everyone (including anonymous visitors) can read properties
CREATE POLICY "properties_select_public"
  ON properties
  FOR SELECT
  USING (true);

-- INSERT: only admins and agents
CREATE POLICY "properties_insert_staff"
  ON properties
  FOR INSERT
  WITH CHECK (public.is_admin_or_agent());

-- UPDATE: only admins and agents
CREATE POLICY "properties_update_staff"
  ON properties
  FOR UPDATE
  USING (public.is_admin_or_agent())
  WITH CHECK (public.is_admin_or_agent());

-- DELETE: only admins and agents
CREATE POLICY "properties_delete_staff"
  ON properties
  FOR DELETE
  USING (public.is_admin_or_agent());
