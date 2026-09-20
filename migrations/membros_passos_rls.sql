-- Permite que usuários autenticados registrem a trajetória no cadastro de membro.
-- Sem esta policy, o insert em membros_passos falha com:
-- "new row violates row-level security policy for table membros_passos"

ALTER TABLE public.membros_passos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_membros_passos" ON public.membros_passos;
DROP POLICY IF EXISTS "authenticated_insert_membros_passos" ON public.membros_passos;
DROP POLICY IF EXISTS "authenticated_update_membros_passos" ON public.membros_passos;
DROP POLICY IF EXISTS "authenticated_delete_membros_passos" ON public.membros_passos;

CREATE POLICY "authenticated_select_membros_passos"
  ON public.membros_passos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert_membros_passos"
  ON public.membros_passos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_update_membros_passos"
  ON public.membros_passos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_delete_membros_passos"
  ON public.membros_passos
  FOR DELETE
  TO authenticated
  USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.membros_passos TO authenticated;
