-- Colunas usadas pelo cadastro/edição de Cursos EMP e permissão para gravar.

ALTER TABLE public.inscricoes
  ADD COLUMN IF NOT EXISTS status varchar,
  ADD COLUMN IF NOT EXISTS data_conclusao date;

ALTER TABLE public.inscricoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_inscricoes" ON public.inscricoes;
DROP POLICY IF EXISTS "authenticated_insert_inscricoes" ON public.inscricoes;
DROP POLICY IF EXISTS "authenticated_update_inscricoes" ON public.inscricoes;
DROP POLICY IF EXISTS "authenticated_delete_inscricoes" ON public.inscricoes;

CREATE POLICY "authenticated_select_inscricoes"
  ON public.inscricoes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert_inscricoes"
  ON public.inscricoes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_update_inscricoes"
  ON public.inscricoes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_delete_inscricoes"
  ON public.inscricoes
  FOR DELETE
  TO authenticated
  USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.inscricoes TO authenticated;
