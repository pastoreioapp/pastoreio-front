-- Seed: progresso de trajetória para o membro victormagalhaessales@gmail.com
-- Pastoreio 1: todos concluídos
-- Pastoreio 2: 3 de 5 concluídos
-- Discipulado: 1 de 3 concluído
-- Líder de Célula: nenhum

INSERT INTO "membros_passos" ("membro_id", "passo_id", "status", "data_inicio", "data_conclusao")

-- Pastoreio 1 (todos concluídos)
SELECT m.id, p.id, 'concluido', '2024-03-10', '2024-06-15'
FROM membros m, passos p
WHERE m.email = 'victormagalhaessales@gmail.com' AND p.nome = 'Assíduo no culto'

UNION ALL
SELECT m.id, p.id, 'concluido', '2024-03-10', '2024-06-15'
FROM membros m, passos p
WHERE m.email = 'victormagalhaessales@gmail.com' AND p.nome = 'Assíduo na Célula'

UNION ALL
SELECT m.id, p.id, 'concluido', '2024-04-01', '2024-05-20'
FROM membros m, passos p
WHERE m.email = 'victormagalhaessales@gmail.com' AND p.nome = 'Livro Acomp. Inicial'

UNION ALL
SELECT m.id, p.id, 'concluido', '2024-05-05', '2024-05-05'
FROM membros m, passos p
WHERE m.email = 'victormagalhaessales@gmail.com' AND p.nome = 'Café com Pastor'

UNION ALL
SELECT m.id, p.id, 'concluido', '2024-06-01', '2024-06-22'
FROM membros m, passos p
WHERE m.email = 'victormagalhaessales@gmail.com' AND p.nome = 'Estação DNA'

UNION ALL
SELECT m.id, p.id, 'concluido', '2024-07-01', '2024-08-10'
FROM membros m, passos p
WHERE m.email = 'victormagalhaessales@gmail.com' AND p.nome = 'Curso Nova Criatura'

UNION ALL
SELECT m.id, p.id, 'concluido', '2024-08-15', '2024-08-15'
FROM membros m, passos p
WHERE m.email = 'victormagalhaessales@gmail.com' AND p.nome = 'Batismo nas Águas'

-- Pastoreio 2 (3 concluídos, 2 pendentes)
UNION ALL
SELECT m.id, p.id, 'concluido', '2024-09-01', '2024-10-15'
FROM membros m, passos p
WHERE m.email = 'victormagalhaessales@gmail.com' AND p.nome = 'Curso Vida Devocional'

UNION ALL
SELECT m.id, p.id, 'concluido', '2024-10-20', '2024-12-01'
FROM membros m, passos p
WHERE m.email = 'victormagalhaessales@gmail.com' AND p.nome = 'Curso Aut. e Submissão'

UNION ALL
SELECT m.id, p.id, 'concluido', '2025-01-10', '2025-03-05'
FROM membros m, passos p
WHERE m.email = 'victormagalhaessales@gmail.com' AND p.nome = 'Curso Família Cristã'

-- Discipulado (1 concluído, 2 pendentes)
UNION ALL
SELECT m.id, p.id, 'concluido', '2025-04-01', '2025-06-20'
FROM membros m, passos p
WHERE m.email = 'victormagalhaessales@gmail.com' AND p.nome = 'Assíduo no Tadel';
