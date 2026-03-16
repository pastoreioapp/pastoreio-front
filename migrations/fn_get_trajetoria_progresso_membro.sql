CREATE OR REPLACE FUNCTION get_trajetoria_progresso_membro(
  p_trajetoria_id BIGINT,
  p_membro_id BIGINT
)
RETURNS TABLE (
  grupo_id BIGINT,
  grupo_nome VARCHAR,
  grupo_ordem INT,
  passo_id BIGINT,
  passo_nome VARCHAR,
  passo_descricao TEXT,
  passo_ordem INT,
  membro_status VARCHAR,
  data_conclusao DATE
)
LANGUAGE sql STABLE
AS $$
  SELECT
    gt.id        AS grupo_id,
    gt.nome      AS grupo_nome,
    gt.ordem     AS grupo_ordem,
    p.id         AS passo_id,
    p.nome       AS passo_nome,
    p.descricao  AS passo_descricao,
    p.ordem      AS passo_ordem,
    mp.status    AS membro_status,
    mp.data_conclusao
  FROM grupos_trajetoria gt
  JOIN grupo_trajetoria_passos gtp ON gtp.grupo_id = gt.id
  JOIN passos p ON p.id = gtp.passo_id
  LEFT JOIN membros_passos mp ON mp.passo_id = p.id AND mp.membro_id = p_membro_id
  WHERE gt.trajetoria_id = p_trajetoria_id
    AND gt.deletado = false
    AND p.deletado = false
  ORDER BY gt.ordem, p.ordem;
$$;
