-- Permite que usuários autenticados vinculem líderes/membros à célula.
-- Sem INSERT policy, criar célula com líder falha com:
-- "new row violates row-level security policy for table membros_celula"

ALTER TABLE public.membros_celula ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_membros_celula" ON public.membros_celula;
DROP POLICY IF EXISTS "authenticated_insert_membros_celula" ON public.membros_celula;
DROP POLICY IF EXISTS "authenticated_update_membros_celula" ON public.membros_celula;
DROP POLICY IF EXISTS "authenticated_delete_membros_celula" ON public.membros_celula;

CREATE POLICY "authenticated_select_membros_celula"
  ON public.membros_celula
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert_membros_celula"
  ON public.membros_celula
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_update_membros_celula"
  ON public.membros_celula
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_delete_membros_celula"
  ON public.membros_celula
  FOR DELETE
  TO authenticated
  USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.membros_celula TO authenticated;
