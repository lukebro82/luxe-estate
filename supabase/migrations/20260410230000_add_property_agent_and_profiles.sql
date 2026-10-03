-- Add created_by to properties and setup profiles table with phone & contact info

-- 1. Add created_by column to properties
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_properties_created_by ON properties(created_by);

-- 2. Create public.profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "profiles_insert_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_insert_own_or_admin"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- 4. Initial sync from auth.users and user_roles to profiles
INSERT INTO public.profiles (id, email, name, avatar_url, phone, role, created_at)
SELECT 
  u.id,
  COALESCE(u.email, ''),
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
    u.email,
    'Unknown'
  ),
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'avatar_url'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'picture'), ''),
    ''
  ),
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'phone'), ''),
    NULLIF(TRIM(u.phone), ''),
    ''
  ),
  COALESCE(ur.role, 'user'),
  u.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = CASE WHEN profiles.name IS NULL OR profiles.name = '' THEN EXCLUDED.name ELSE profiles.name END,
  avatar_url = CASE WHEN profiles.avatar_url IS NULL OR profiles.avatar_url = '' THEN EXCLUDED.avatar_url ELSE profiles.avatar_url END,
  phone = CASE WHEN profiles.phone IS NULL OR profiles.phone = '' THEN EXCLUDED.phone ELSE profiles.phone END,
  role = EXCLUDED.role;

-- 5. Trigger on auth.users for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, phone, role, created_at)
  VALUES (
    new.id,
    COALESCE(new.email, ''),
    COALESCE(
      NULLIF(TRIM(new.raw_user_meta_data->>'name'), ''),
      NULLIF(TRIM(new.raw_user_meta_data->>'full_name'), ''),
      new.email,
      'Unknown'
    ),
    COALESCE(
      NULLIF(TRIM(new.raw_user_meta_data->>'avatar_url'), ''),
      NULLIF(TRIM(new.raw_user_meta_data->>'picture'), ''),
      ''
    ),
    COALESCE(
      NULLIF(TRIM(new.raw_user_meta_data->>'phone'), ''),
      NULLIF(TRIM(new.phone), ''),
      ''
    ),
    'user',
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Update get_users_for_admin to include phone
CREATE OR REPLACE FUNCTION public.get_users_for_admin()
RETURNS TABLE (
  user_id uuid,
  email text,
  name text,
  phone text,
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
      p.name,
      NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
      NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
      u.email,
      'Unknown'
    )::text AS name,
    COALESCE(
      p.phone,
      NULLIF(TRIM(u.raw_user_meta_data->>'phone'), ''),
      NULLIF(TRIM(u.phone), ''),
      ''
    )::text AS phone,
    COALESCE(
      p.avatar_url,
      NULLIF(TRIM(u.raw_user_meta_data->>'avatar_url'), ''),
      NULLIF(TRIM(u.raw_user_meta_data->>'picture'), ''),
      ''
    )::text AS avatar_url,
    u.created_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  ORDER BY u.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_users_for_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_users_for_admin() TO authenticated;

-- 7. RPC to update user profile (including phone)
CREATE OR REPLACE FUNCTION public.update_user_profile_admin(
  target_user_id uuid,
  target_name text,
  target_phone text,
  target_avatar_url text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is admin or editing own profile
  IF NOT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  ) AND auth.uid() != target_user_id THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.profiles (id, name, phone, avatar_url, updated_at)
  VALUES (target_user_id, target_name, target_phone, target_avatar_url, now())
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(target_name, profiles.name),
    phone = COALESCE(target_phone, profiles.phone),
    avatar_url = COALESCE(target_avatar_url, profiles.avatar_url),
    updated_at = now();

  -- Also sync with auth.users raw_user_meta_data
  UPDATE auth.users
  SET raw_user_meta_data = 
    jsonb_set(
      jsonb_set(
        jsonb_set(
          COALESCE(raw_user_meta_data, '{}'::jsonb),
          '{name}', to_jsonb(COALESCE(target_name, ''))
        ),
        '{phone}', to_jsonb(COALESCE(target_phone, ''))
      ),
      '{avatar_url}', to_jsonb(COALESCE(target_avatar_url, ''))
    )
  WHERE id = target_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.update_user_profile_admin(uuid, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_user_profile_admin(uuid, text, text, text) TO authenticated;
