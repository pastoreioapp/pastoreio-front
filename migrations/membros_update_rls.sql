-- Permite que usuários autenticados atualizem membros e o cargo na célula.
-- Sem UPDATE policy, o Supabase aceita o request e não grava nenhuma linha.

ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros_celula ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_update_membros" ON public.membros;
CREATE POLICY "authenticated_update_membros"
  ON public.membros
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_membros_celula" ON public.membros_celula;
CREATE POLICY "authenticated_update_membros_celula"
  ON public.membros_celula
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT, UPDATE ON public.membros TO authenticated;
GRANT SELECT, UPDATE ON public.membros_celula TO authenticated;
