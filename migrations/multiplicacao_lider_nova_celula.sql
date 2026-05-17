ALTER TABLE public.multiplicacao
  ADD COLUMN IF NOT EXISTS lider_membro_id bigint REFERENCES public.membros(id) ON DELETE SET NULL;

ALTER TABLE public.multiplicacao_membros
  ADD COLUMN IF NOT EXISTS lider_nova_celula boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_multiplicacao_lider_membro_id
  ON public.multiplicacao(lider_membro_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_multiplicacao_membros_um_lider
  ON public.multiplicacao_membros(multiplicacao_id)
  WHERE lider_nova_celula IS TRUE AND deletado = false;
