-- Colunas usadas pelo cadastro/edição de Cursos EMP.

ALTER TABLE public.inscricoes
  ADD COLUMN IF NOT EXISTS status varchar,
  ADD COLUMN IF NOT EXISTS data_conclusao date;
