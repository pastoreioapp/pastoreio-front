-- Audit columns for membros_passos + completion tracking for inscricoes

ALTER TABLE public.membros_passos
  ADD COLUMN IF NOT EXISTS criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS criado_por VARCHAR(255) NOT NULL DEFAULT 'sistema',
  ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMP,
  ADD COLUMN IF NOT EXISTS atualizado_por VARCHAR(255),
  ADD COLUMN IF NOT EXISTS deletado BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.inscricoes
  ADD COLUMN IF NOT EXISTS concluido_em DATE,
  ADD COLUMN IF NOT EXISTS concluido_por VARCHAR(255);

COMMENT ON COLUMN public.inscricoes.concluido_em IS 'Data em que a inscrição foi marcada como concluída manualmente ou pelo sistema.';
COMMENT ON COLUMN public.inscricoes.concluido_por IS 'Identificador de quem marcou a inscrição como concluída.';
