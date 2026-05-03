--Migration para adicionar as colunas com data de saída e desvinculado por:
ALTER TABLE public.mebmros_celula
	ADD COLUMN data saída	DATE	DEFAULT NULL,
	ADD COLUMN desvinculado por	TEXT	DEFAULT NULL;

--Index para filtrar membros ativos (sem data de saída)
CREATE INDEX idx_membros_celula_ativos
	ON public.membros_celula (celula_id)
	WHERE data saída IS NULL AND deletado = FALSE

COMMENT ON COLUMN public.membros_celula.data_saida IS 'Data em que o membro foi desvinculado da célua. NULL = vínculo ativo.'
COMMENT ON COLUMN public.membros_celula.desvinculado_por IS 'Identificador de quem realizou a desvinculação (email ou user id)