# Guia de correções pós-merge

Este documento consolida o code review de merge-readiness da branch
`feat/listagem-celulas` contra `origin/main`.

- Diff revisado: `origin/main...HEAD`
- Merge-base revisado: `0bd2035284b29c2874d48a32cce6fda018b5b8e2`
- HEAD revisado: `e53a6201422dc5db13b6e07c5480e6990d43e8fb`
- Resultado do review: **não mergear sem correções**
- Nenhuma correção funcional foi implementada durante o review.

> Os números de linha abaixo são aproximados e correspondem ao HEAD revisado.
> Após o merge, localizar os trechos pelo nome do método quando necessário.

## Objetivo da próxima branch

Corrigir os bloqueios de build, autorização e integridade de dados; depois
alinhar os fluxos às regras obrigatórias do `AGENTS.md`.

## Prioridade 0 — bloqueios

### 1. Restaurar o build TypeScript — ✅ Finalizado

O projeto usa `target: "es5"` sem `downlevelIteration`. Os spreads de iteráveis
adicionados pela branch geram `TS2802`.

Arquivos:

- `src/app/(private)/celulas/components/ModalCadastroCelula.tsx:132`
- `src/modules/celulas/infra/membros-celula.repository.ts:168`
- `src/modules/cursos/infra/inscricao.repository.ts:54`
- `src/modules/trajetoria/application/trajetoria.service.ts:49-50`

Ações:

- Substituir spreads de `Map.values()` e `Set` por uma construção compatível,
  como `Array.from(...)`; ou alterar o target somente se houver uma decisão
  explícita de modernização para o projeto inteiro.
- Confirmar que não restaram outras iterações incompatíveis.

Critério de aceite:

- `npx tsc --noEmit` passa.
- `npm run build` passa.

### 2. Restringir as policies RLS — ✅ Finalizado

As migrations abaixo concedem acesso irrestrito a qualquer usuário
autenticado por meio de `USING (true)` e `WITH CHECK (true)`:

- `migrations/inscricoes_cursos.sql:14-39`
- `migrations/membros_celula_rls.sql:12-37`
- `migrations/membros_passos_rls.sql:12-37`
- `migrations/membros_update_rls.sql:8-24`

Isso não respeita os perfis nem o escopo de célula usado pela UI. POrém, um acordo que foi feito no time foi de não definir RLS neste momento e configurar isto somente no final do projeto.

Ações:

- Remover as policies RLS que foram adicionadas e deixar igual aos outros scripts/funcionamento existentes.

### 4. Adicionar autorização server-side e impedir IDOR

Trechos principais:

- `src/app/actions/membros/index.ts:88-101`
- `src/modules/secretaria/application/cadastro-membro.service.ts:115-120`
- `src/app/actions/celulas/index.ts:68-76`
- `src/app/actions/celulas/index.ts:102-108`

As actions aceitam IDs fornecidos pelo cliente sem validar papel, célula ou
propriedade do vínculo. Em `updateFromUI`, o `vinculoId` não é confirmado como
pertencente ao `membroId`.

Ações:

- Obter o usuário com `supabase.auth.getUser()` e rejeitar ausência de usuário.
- Resolver perfil, membro e célula do ator no servidor.
- Validar autorização no service/use case antes de qualquer escrita.
- Confirmar que `vinculoId`, `membroId` e `celulaId` pertencem ao mesmo contexto.
- Não usar `celulaId` vindo do cliente como prova de autorização.
- Validar no service a regra de que líderes/auxiliares não podem ser
  desvinculados, caso essa regra de UI seja realmente a regra de negócio.
- Validar que `liderMembroId` existe, está ativo e não está deletado.

Critério de aceite:

- Alterar IDs no payload não permite atingir registros fora do escopo.
- A action e o Data API aplicam a mesma política de acesso.

### 5. Evitar exclusão de inscrições após erro de carregamento

Trechos:

- `src/app/(private)/membros/components/registro-membros/registerMembro.tsx:203-222`
- `src/app/(private)/membros/components/registro-membros/registerMembro.tsx:345-360`
- `src/modules/cursos/application/inscricao.service.ts:64-68`

Na edição, `getCursosDoMembro(...).catch(() => [])` converte erro em lista
vazia. O catálogo passa a representar todas as turmas como `NAO_INICIADO`,
`cursosProntos` vira `true` e o save pode executar soft delete de todas as
inscrições reais.

Ações:

- Não converter falha de leitura em estado vazio válido.
- Manter `cursosProntos = false` quando qualquer leitura necessária falhar.
- Exibir o erro e impedir o sync/save de cursos enquanto os dados não forem
  carregados com sucesso.
- Diferenciar explicitamente “nenhum curso” de “erro ao carregar”.

Critério de aceite:

- Uma falha transitória de leitura nunca gera update ou soft delete.
- Salvar apenas dados pessoais não altera cursos que não foram carregados.

### 6. Tratar inscrições legadas antes do sync

Trechos:

- `migrations/inscricoes_cursos.sql:3-5`
- `src/modules/cursos/application/mapper.ts:27`
- `src/modules/cursos/application/inscricao.service.ts:64-68`

A migration adiciona `status` nullable e sem backfill. O mapper converte
`NULL`/valor desconhecido para `NAO_INICIADO`, enquanto o sync interpreta esse
status como remoção.

Ações:

- Definir a semântica dos registros legados.
- Fazer backfill de `status` antes de habilitar o novo fluxo.
- Adicionar default, `NOT NULL` e/ou constraint de valores válidos quando
  compatível com os dados.
- Validar `status` no service com `isStatusTurma`; não aceitar strings
  arbitrárias.
- Não interpretar ausência/valor inválido como uma intenção de exclusão.

Critério de aceite:

- A primeira edição após a migration não remove inscrições existentes.
- Valores inválidos são rejeitados com erro descritivo.

### 7. Evitar perda de trajetória quando não houver grupos

Trechos:

- `src/app/(private)/membros/components/registro-membros/registerMembro.tsx:210-217`
- `src/app/(private)/membros/components/registro-membros/registerMembro.tsx:335-360`
- `src/app/(private)/membros/components/registro-membros/components/trajetoria.tsx:30-72`
- `src/modules/trajetoria/application/trajetoria.service.ts:49-53`

Quando a trajetória retorna um objeto válido sem grupos, a UI usa
`initialFases`, cujos itens não possuem IDs, mas marca a trajetória como pronta.
O save produz a lista desejada vazia e o sync remove os passos concluídos.

Ações:

- Não tratar o mock `initialFases` como dado persistível.
- Não marcar `trajetoriaPronta` quando não houver IDs reais carregados.
- Exibir estado vazio/erro e não sincronizar nessas condições.
- No service, limitar inserções/remoções aos passos da trajetória ativa e
  validar todos os IDs recebidos.

Critério de aceite:

- Salvar dados pessoais com trajetória vazia, indisponível ou sem grupos não
  remove passos existentes.
- IDs inexistentes ou fora da trajetória ativa são rejeitados.

## Prioridade 1 — consistência funcional

### 8. Tornar a criação de célula atômica

Trecho:

- `src/modules/celulas/application/celula.service.ts:60-84`

A célula é inserida antes do vínculo do líder. Se o segundo passo falhar, fica
uma célula órfã e uma nova tentativa pode gerar duplicidade.

Ações:

- Executar criação da célula e vínculo do líder em uma única transação no banco,
  preferencialmente por uma função/RPC encapsulada na infra.
- Se transação não for viável, implementar compensação segura e testada.
- Manter as regras de negócio no service e os detalhes Supabase na infra.

Critério de aceite:

- Falha ao vincular o líder não deixa célula persistida.

### 9. Tornar cadastro/edição composta de membro atômicos

Trechos:

- `src/modules/secretaria/application/cadastro-membro.service.ts:61-85`
- `src/modules/secretaria/application/cadastro-membro.service.ts:97-137`
- `src/modules/cursos/application/inscricao.service.ts:59-94`
- `src/modules/trajetoria/application/trajetoria.service.ts:49-53`

Membro, cargo, trajetória e cursos são gravados sequencialmente. Uma falha
intermediária retorna erro, mas mantém escritas anteriores.

Ações:

- Encapsular o fluxo composto em transação/RPC ou definir compensações.
- Garantir que o retorno de erro corresponda ao estado final persistido.
- Evitar múltiplas atualizações sequenciais de cursos sem atomicidade.

Critério de aceite:

- Falha em qualquer etapa não deixa atualização parcial.

### 10. Voltar a excluir cursos inativos do catálogo

Trecho:

- `src/modules/cursos/infra/turma.repository.ts:26-35`

Foi removido o filtro `cursos.ativo = true`; o filtro em memória verifica apenas
`deletado`.

Ações:

- Restaurar o filtro de curso ativo na query ou no mapper/repository.
- Preservar inscrições históricas em cursos inativos apenas na edição do membro,
  sem oferecê-las para novos cadastros.

Critério de aceite:

- Cursos inativos não aparecem para nova inscrição.
- Cursos históricos continuam visíveis quando necessário.

### 11. Verificar sucesso real ao desvincular

Trecho:

- `src/modules/celulas/infra/membros-celula.repository.ts:141-153`

`desvincular` verifica apenas `error`; com RLS, um update pode afetar zero linhas
sem retornar erro.

Ações:

- Usar `.select("id")` após o update.
- Lançar erro descritivo quando nenhuma linha for atualizada.
- Manter os filtros de vínculo ativo e não deletado na escrita.

Critério de aceite:

- A UI nunca apresenta sucesso quando nenhuma linha foi alterada.

## Prioridade 2 — arquitetura obrigatória

### 12. Deixar Server Actions finas

Trechos:

- `src/app/actions/celulas/index.ts:50-65`
- `src/app/actions/membros/index.ts:88-113`

Problemas:

- `listMembrosDisponiveisParaLiderar` coordena dois services e aplica filtros de
  negócio dentro da action.
- `updateMembroFromUI` usa `try/catch`, `console.error` e envelope de sucesso,
  contrariando o padrão de propagação natural do `AGENTS.md`.
- Actions recebem payloads `any`.

Ações:

- Criar/mover o caso de uso “listar membros disponíveis para liderar” para
  application.
- Tipar DTOs de entrada e saída.
- Remover `try/catch` das actions; tratar erro na UI/hook.
- Fazer a action apenas montar dependências, obter o usuário e chamar o service.

### 13. Manter `snake_case` exclusivamente na infra

Trecho:

- `src/modules/cursos/application/inscricao.service.ts:84-89`

O service monta payload de persistência com `data_conclusao`,
`atualizado_em` e `atualizado_por`.

Ações:

- Usar DTO/application model em camelCase.
- Mover a conversão para payload Supabase para mapper/repository em `infra`.
- Evitar importar mapper de infra em application, como ocorre em
  `src/modules/secretaria/application/membro.service.ts`.

### 14. Corrigir auditoria

Trechos:

- `src/app/actions/celulas/index.ts:34-37`
- `src/app/actions/membros/index.ts:52-58`

`getAuditUserId` prefere `user.email` e aceita o fallback `"sistema"`.

Ações:

- Usar exclusivamente o `user.id` validado por `auth.getUser()`.
- Rejeitar a operação quando não houver usuário autenticado.
- Passar o ID ao service para `criado_por` e `atualizado_por`.

## Correções relacionadas já existentes na base

Estes problemas não foram necessariamente introduzidos pelo diff, mas afetam os
fluxos revisados e devem ser considerados na branch de correção.

### Filtro de soft delete de células

Arquivo:

- `src/modules/celulas/infra/celula.repository.ts:49,65`

`.or("deletado.eq.false,ativa.eq.false")` inclui uma célula com
`deletado=true` quando `ativa=false`.

Correção esperada:

- Filtrar sempre `.eq("deletado", false)`.
- Manter células inativas não deletadas na listagem somente conforme a regra de
  negócio.

### Migration inválida de `membros_celula`

Arquivo:

- `migrations/alter_membro_celula.sql`

O arquivo contém nomes incorretos (`mebmros_celula`, `data saída`,
`desvinculado por`) e problemas de sintaxe. O código depende de `data_saida` e
`desvinculado_por`.

Correção esperada:

- Criar uma migration válida e idempotente com os nomes corretos.
- Confirmar o estado real do banco antes de aplicar para evitar conflito com
  colunas criadas manualmente.
- Versionar índice para vínculos ativos.

## Decisões de negócio a confirmar

- Líder de célula inativa deve ficar disponível para liderar outra célula?
  Atualmente `findMembroIdsLideresAtivos` ignora `celulas.ativa`.
- Líder e auxiliar devem aparecer e ser editáveis na listagem de membros?
- Ao selecionar `NAO_INICIADO`, a inscrição deve ser removida ou mantida com
  esse status?
- Passos de trajetórias antigas devem ser preservados como histórico?
- Quem pode criar novas células: líder, administradores ou ambos?

Essas decisões devem virar validações server-side e policies RLS, não apenas
condições visuais.

## Roteiro de verificação

### Verificações estáticas

Executar:

```bash
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

Estado durante o review:

- `npm run lint`: passou.
- `git diff --check`: passou.
- `npx tsc --noEmit`: falhou com `TS2802`.
- `npm run build`: falhou na checagem de tipos.

### Banco e autorização

Validar em banco local/preview reconstruído pelas migrations:

- SELECT/INSERT/UPDATE permitidos apenas para perfis e células corretos.
- Usuário comum não consegue mutar dados diretamente pelo client Supabase.
- Hard delete não está disponível nas tabelas com soft delete.
- Cadastro/listagem/edição de membros funcionam após habilitar RLS.
- Dados legados de inscrições recebem backfill sem perda.
- Falhas RLS retornam erro, nunca sucesso com zero linhas afetadas.

### Casos de regressão

- Falha ao carregar cursos e, em seguida, tentativa de salvar membro.
- Trajetória ativa sem grupos/passos.
- Falha ao vincular líder durante criação de célula.
- Falha no meio da atualização composta de membro.
- Célula inativa versus célula soft-deleted.
- Curso inativo no cadastro e curso histórico na edição.
- Tentativa de trocar `membroId`, `vinculoId` ou `celulaId` no payload.
- Usuários nos perfis membro, auxiliar, líder e administrador.

### Browser/E2E

Cobrir pelo menos:

- Criar célula com e sem líder.
- Listar, pesquisar e abrir detalhe de célula.
- Cadastrar, editar e desvincular membro.
- Editar cursos e trajetória sem alterar dados não carregados.
- Estados vazio, loading, erro e permissão negada.

## Itens não verificados no review original

- Browser/E2E, porque o build não passava.
- Aplicação das migrations e dados reais do Supabase.
- CI remoto.
- Testes automatizados; nenhuma suíte foi encontrada no repositório.
