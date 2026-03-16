-- Seed: Trajetória padrão com grupos e passos

INSERT INTO "trajetoria" ("nome", "descricao", "ativa", "criado_em", "criado_por")
VALUES ('Trajetória Pastoral', 'Trajetória padrão de acompanhamento pastoral', true, NOW(), 'sistema');

-- Grupos da trajetória
INSERT INTO "grupos_trajetoria" ("trajetoria_id", "nome", "ordem", "criado_em", "criado_por")
VALUES
  ((SELECT id FROM trajetoria WHERE nome = 'Trajetória Pastoral'), 'Pastoreio 1', 1, NOW(), 'sistema'),
  ((SELECT id FROM trajetoria WHERE nome = 'Trajetória Pastoral'), 'Pastoreio 2', 2, NOW(), 'sistema'),
  ((SELECT id FROM trajetoria WHERE nome = 'Trajetória Pastoral'), 'Discipulado', 3, NOW(), 'sistema'),
  ((SELECT id FROM trajetoria WHERE nome = 'Trajetória Pastoral'), 'Líder de Célula', 4, NOW(), 'sistema');

-- Passos do Pastoreio 1
INSERT INTO "passos" ("nome", "ordem", "criado_em", "criado_por") VALUES
  ('Assíduo no culto',       1, NOW(), 'sistema'),
  ('Assíduo na Célula',      2, NOW(), 'sistema'),
  ('Livro Acomp. Inicial',   3, NOW(), 'sistema'),
  ('Café com Pastor',        4, NOW(), 'sistema'),
  ('Estação DNA',            5, NOW(), 'sistema'),
  ('Curso Nova Criatura',    6, NOW(), 'sistema'),
  ('Batismo nas Águas',      7, NOW(), 'sistema');

-- Passos do Pastoreio 2
INSERT INTO "passos" ("nome", "ordem", "criado_em", "criado_por") VALUES
  ('Curso Vida Devocional',    1, NOW(), 'sistema'),
  ('Curso Aut. e Submissão',   2, NOW(), 'sistema'),
  ('Curso Família Cristã',     3, NOW(), 'sistema'),
  ('Servir em Ministério',     4, NOW(), 'sistema'),
  ('Encontro com Deus',        5, NOW(), 'sistema');

-- Passos do Discipulado
INSERT INTO "passos" ("nome", "ordem", "criado_em", "criado_por") VALUES
  ('Assíduo no Tadel',              1, NOW(), 'sistema'),
  ('Curso Ide e Fazei Discípulo',   2, NOW(), 'sistema'),
  ('Expresso 1',                    3, NOW(), 'sistema');

-- Passos do Líder de Célula
INSERT INTO "passos" ("nome", "ordem", "criado_em", "criado_por") VALUES
  ('Curso TLC',            1, NOW(), 'sistema'),
  ('Expresso 2',           2, NOW(), 'sistema'),
  ('Aprovação do Pastor',  3, NOW(), 'sistema');

-- Vincular passos aos grupos (grupo_trajetoria_passos)
INSERT INTO "grupo_trajetoria_passos" ("grupo_id", "passo_id")
SELECT gt.id, p.id
FROM "grupos_trajetoria" gt, "passos" p
WHERE gt.nome = 'Pastoreio 1'
  AND p.nome IN ('Assíduo no culto', 'Assíduo na Célula', 'Livro Acomp. Inicial', 'Café com Pastor', 'Estação DNA', 'Curso Nova Criatura', 'Batismo nas Águas');

INSERT INTO "grupo_trajetoria_passos" ("grupo_id", "passo_id")
SELECT gt.id, p.id
FROM "grupos_trajetoria" gt, "passos" p
WHERE gt.nome = 'Pastoreio 2'
  AND p.nome IN ('Curso Vida Devocional', 'Curso Aut. e Submissão', 'Curso Família Cristã', 'Servir em Ministério', 'Encontro com Deus');

INSERT INTO "grupo_trajetoria_passos" ("grupo_id", "passo_id")
SELECT gt.id, p.id
FROM "grupos_trajetoria" gt, "passos" p
WHERE gt.nome = 'Discipulado'
  AND p.nome IN ('Assíduo no Tadel', 'Curso Ide e Fazei Discípulo', 'Expresso 1');

INSERT INTO "grupo_trajetoria_passos" ("grupo_id", "passo_id")
SELECT gt.id, p.id
FROM "grupos_trajetoria" gt, "passos" p
WHERE gt.nome = 'Líder de Célula'
  AND p.nome IN ('Curso TLC', 'Expresso 2', 'Aprovação do Pastor');

-- Vincular todos os passos à trajetória (trajetoria_passos)
INSERT INTO "trajetoria_passos" ("trajetoria_id", "passo_id")
SELECT t.id, p.id
FROM "trajetoria" t, "passos" p
WHERE t.nome = 'Trajetória Pastoral'
  AND p.deletado = false;
