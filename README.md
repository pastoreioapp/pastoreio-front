# Pastoreio App

Aplicação full stack (Next.js + Supabase) para gestão de células e membros. Este README é um guia para quem está chegando no projeto e quer entender a estrutura e como contribuir.

---

## O que você precisa saber antes de começar

- **Frontend**: o que o usuário vê e interage (telas, botões, formulários). Fica em `src/app` (páginas) e `src/ui` (componentes, hooks, estado).
- **Backend**: a lógica e os dados (regras de negócio, banco de dados). Fica em `src/modules` e em `src/app/actions`.
- **Server Action**: função que roda no servidor e pode acessar o banco; a tela chama essa função em vez de falar direto com o banco. Quem mexe em frontend só precisa **chamar** a action; quem mexe em backend **cria** a action e a lógica nos módulos.

Se você for focar em **telas e componentes**, vai trabalhar principalmente em `app` e `ui`. Se for focar em **dados e regras**, vai trabalhar em `modules` e `app/actions`.

---

## Subindo a aplicação

1. Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

2. Instale as dependências e rode o servidor:

```bash
npm install
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## Como o projeto está organizado

A pasta `src` está dividida em quatro “mundos”: **app**, **ui**, **modules** e **shared**. Cada um tem um papel claro.

### Visão geral

```
src/
├── app/          → Rotas, páginas e Server Actions (o “esqueleto” da aplicação)
├── ui/           → Componentes reutilizáveis, hooks e estado global (a “cara” da aplicação)
├── modules/      → Lógica de negócio e acesso a dados (o “cérebro” por área)
└── shared/       → Código usado em vários lugares (ex.: cliente do Supabase)
```

### 1. `app/` — Rotas, páginas e Server Actions

Aqui ficam as **páginas** (uma pasta = uma rota) e as **Server Actions** (funções que rodam no servidor).

| Onde | O que fica |
|------|------------|
| `app/(private)/...` | Páginas que exigem login (dashboard, membros, encontros, etc.) |
| `app/(public)/...` | Páginas públicas (login, registro, recuperar senha) |
| `app/actions/` | Server Actions: funções que o frontend chama para listar/criar/editar/excluir dados |
| `app/api/` | Rotas HTTP (ex.: callback de login do Google) |

**Exemplo**: a página de membros está em `app/(private)/membros/page.tsx`. Ela usa um hook que chama a Server Action `listMembros()`, que está em `app/actions/membros/index.ts`.

### 2. `ui/` — Componentes, hooks e estado

Aqui ficam tudo que é **reutilizável** na interface: componentes, hooks e estado global (Redux).

| Onde | O que fica |
|------|------------|
| `ui/components/` | Botões, cards, cabeçalho, sidebar, formulários comuns, etc. |
| `ui/hooks/` | Hooks que várias páginas usam (ex.: autenticação) |
| `ui/stores/` | Estado global (Redux): usuário logado, sidebar aberta/fechada |
| `ui/utils/` | Funções auxiliares (tema, validação, etc.) |

**Exemplo**: o botão “Membros” no menu usa o componente `Sidebar` em `ui/components/sidebar/`. O nome do usuário no header vem do estado em `ui/stores/` e do hook `useAppAuthentication` em `ui/hooks/`.

### 3. `modules/` — Lógica por área (backend)

Cada **módulo** é uma área do sistema. Dentro dele a lógica é organizada em **domain**, **application** e **infra**.

| Módulo | O que é |
|--------|--------|
| **secretaria** | Cadastro e gestão de membros (listar, criar, editar, excluir) |
| **controleacesso** | Login, logout, perfis e dados do usuário logado |
| **celulas** | Encontros de célula (listagem e dados) |

Dentro de cada módulo:

| Pasta | Papel (de forma simples) |
|-------|--------------------------|
| **domain** | Tipos e regras puras (ex.: “o que é um Membro”, “o que é um Encontro”). Não acessa banco nem React. |
| **application** | Serviços que orquestram a lógica (ex.: “listar membros”, “mapear usuário do Supabase para o formato da aplicação”). Usam o que está no domain. |
| **infra** | Acesso real ao banco (Supabase) ou a APIs externas. Implementa “buscar/salvar no banco” usando o domain. |

**Exemplo**: para listar membros, a Server Action em `app/actions/membros/` chama o `MembroService` em `modules/secretaria/application/`. O service usa o `MembroRepository` em `modules/secretaria/infra/`, que conversa com o Supabase.

### 4. `shared/` — Código compartilhado

Aqui fica o que **várias partes** do projeto usam, por exemplo o cliente do Supabase (browser e servidor): `shared/supabase/client.ts` e `shared/supabase/server.ts`. Não colocamos aqui lógica de negócio, só infraestrutura compartilhada.

---

## Como contribuir no dia a dia

### “Quero mudar ou criar uma tela”

- **Páginas**: crie ou edite arquivos em `app/(private)/...` ou `app/(public)/...`.
- **Layout e componentes da tela**: use ou crie componentes em `ui/components/`.
- **Estado da tela (loading, lista, erro)**: use hooks em `app/(private)/nome-da-pagina/hooks/` ou em `ui/hooks/` se for reutilizável.
- **Buscar dados**: chame Server Actions de `app/actions/...` (ex.: `listMembros()`, `listEncontros()`). Não chame o banco nem os módulos direto do componente.

### “Quero mudar um componente que aparece em várias páginas”

- Trabalhe em `ui/components/` (header, sidebar, cards, inputs, etc.).
- Se precisar de dados, receba por **props** ou use um hook que chame uma Server Action.

### “Quero adicionar um novo campo ou tipo de dado”

- **Tipos da tela / DTOs**: em geral ficam em `modules/nome-do-modulo/application/dtos.ts` ou em `domain/types.ts`, conforme o módulo.
- **Regras e validações** que não dependem de tela nem de banco: em `modules/.../domain/`.

### “Quero que uma tela busque ou salve algo no banco”

- **Quem mexe em frontend**: na página ou no hook, chame a Server Action correspondente (ex.: `listMembros()`, `createMembro(dto)`). As actions ficam em `app/actions/...`.
- **Quem mexe em backend**: (1) implemente ou ajuste o serviço em `modules/.../application/`, (2) se precisar acessar o banco, use ou crie repositório em `modules/.../infra/`, (3) exponha a ação em `app/actions/...` chamando esse serviço.

### “Quero criar uma nova funcionalidade (nova área do sistema)”

1. Defina se ela se encaixa em um módulo existente (**secretaria**, **controleacesso**, **celulas**) ou se é uma nova área.
2. Se for nova área: crie uma pasta em `modules/` (ex.: `modules/minha-area/`) com `domain/`, `application/` e `infra/` conforme o padrão dos outros módulos.
3. Crie as Server Actions em `app/actions/minha-area/` que usem os serviços desse módulo.
4. Crie a página em `app/(private)/minha-rota/` e os componentes/hooks em `ui/` ou na própria pasta da página, conforme o que for reutilizável.