ALTER TABLE public.celulas
  ADD COLUMN IF NOT EXISTS rede varchar NULL;

COMMENT ON COLUMN public.celulas.rede IS 'Rede da célula: Jovens, Casais ou Crianças.';
