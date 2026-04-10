-- Lista usuarios de auth para el panel admin. Solo ejecutable por filas con role = admin en user_roles.
-- Aplicar con: Supabase CLI `supabase db push` / migraciones, o pegar en SQL Editor.

CREATE OR REPLACE FUNCTION public.get_users_for_admin()
RETURNS TABLE (
  user_id uuid,
  email text,
  name text,
  avatar_url text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    u.id AS user_id,
    COALESCE(u.email, '')::text AS email,
    COALESCE(
      NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
      NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
      u.email,
      'Unknown'
    )::text AS name,
    COALESCE(
      NULLIF(TRIM(u.raw_user_meta_data->>'avatar_url'), ''),
      NULLIF(TRIM(u.raw_user_meta_data->>'picture'), ''),
      ''
    )::text AS avatar_url,
    u.created_at
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_users_for_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_users_for_admin() TO authenticated;
