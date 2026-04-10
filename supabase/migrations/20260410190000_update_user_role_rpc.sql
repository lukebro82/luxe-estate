CREATE OR REPLACE FUNCTION public.update_user_role_admin(target_user_id uuid, target_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validar si el nuevo rol es admitido
  IF target_role NOT IN ('admin', 'user', 'agent') THEN
    RAISE EXCEPTION 'invalid role' USING ERRCODE = '22023';
  END IF;

  -- Validar si el usuario que llama la función tiene rol "admin"
  IF NOT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  -- Hacer la actualización (upsert) en la tabla, ignorando las reglas RLS
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, target_role)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
END;
$$;

REVOKE ALL ON FUNCTION public.update_user_role_admin(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_user_role_admin(uuid, text) TO authenticated;
