# Arquitetura do Projeto (Next.js Full Stack + Clean Architecture)

Este documento define **regras arquiteturais obrigatórias** do projeto. Ele existe para:

* Garantir consistência técnica
* Evitar acoplamento indevido ao framework
* Facilitar refatorações
* Servir como **fonte de verdade** para humanos e IA (Cursor / LLMs)

**As regras abaixo não são sugestões. São decisões arquiteturais.**

---

## 1. Princípios Arquiteturais

### 1.1 Regra de ouro

> O domínio não conhece Next.js, React, Supabase ou qualquer framework.

Se amanhã Next.js for removido, o domínio deve continuar funcionando sem alterações.
Se isso não for verdade, a implementação está incorreta.

### 1.2 Framework como detalhe

* Next.js (`app/`) é apenas um **adapter**
* React é apenas **camada de apresentação**
* Supabase é apenas **infraestrutura**

Nenhuma regra de negócio pode depender diretamente dessas tecnologias.

### 1.3 Fluxo obrigatório de dependências

```text
UI → Adapters (Server Actions / API)
Adapters → Application (Use Cases)
Application → Infra e/ou Domain
Infra → Domain (quando necessário)
```

❌ Dependências inversas são proibidas.

### 1.4 Concessão adotada neste projeto

> A camada de `application` pode depender diretamente de repositórios concretos da camada `infra` pois isso simplifica o entendimento e a manutenção do código para a equipe.
> O isolamento obrigatório continua sendo do `domain`, que não deve conhecer infraestrutura.

---

## 2. Estrutura Oficial do Projeto

```text
src/
│
├── app/                     # Framework Next.js (routing, server actions, api)
│   ├── api/                 # API Routes (adapters HTTP)
│   ├── actions/             # Server Actions (adapters UI → backend)
│   ├── (pages)/             # Pages / layouts
│   └── layout.tsx
│
├── ui/                      # Camada de apresentação (React)
│   ├── components/          # Componentes visuais
│   ├── hooks/               # Hooks compartilhados de UI
│   ├── contexts/            # Contexts globais
│   └── stores/              # Redux / Zustand
│
├── modules/                 # Domínio + Application + Infra por feature
│   └── <feature>/
│       ├── domain/          # Entidades, VOs, interfaces
│       ├── application/     # Use Cases, DTOs
│       └── infra/           # Implementações (ex.: repositórios Supabase)
│
└── shared/                  # Código compartilhado
    └── supabase/            # Clientes Supabase (client.ts, server.ts)
                             # Usados por modules/*/infra e app/
```

---

## 3. Regras por Camada

### 3.1 `modules/` por feature

Cada feature deve organizar seu código em `domain`, `application` e `infra`.

* `domain` e `application` devem ser 100% testáveis sem framework
* `infra` concentra dependências técnicas
* React, Next.js, hooks e contexts não pertencem a `modules/*/domain` nem `modules/*/application`
* Fetch / HTTP também não pertencem ao domínio nem à aplicação

### 3.2 Domain (`modules/*/domain`)

Responsabilidades:

* Regras de negócio
* Invariantes
* Validações

Nunca deve:

* Acessar banco
* Conhecer DTOs de UI
* Conhecer formato HTTP
* Conhecer infraestrutura

### 3.3 Application (`modules/*/application`)

Responsabilidades:

* Orquestrar regras
* Executar fluxos de negócio
* Chamar repositórios da própria feature
* Opcionalmente usar interfaces quando houver ganho real de desacoplamento

Pode:

* Importar repositórios concretos de `infra/` da mesma feature
* Manter a orquestração principal do caso de uso fora de `app/` e `ui/`

Nunca deve:

* Conhecer React ou Next.js

### 3.4 Infra (`modules/*/infra`)

Responsabilidades:

* Acesso a banco (Supabase)
* Integrações externas
* Repositórios concretos consumidos pela camada de `application`
* Mappers, payloads, row types e tipos auxiliares de persistência

Pode também:

* Implementar interfaces do domínio quando isso trouxer benefício claro

Diretriz de legibilidade:

* Quando um repository começar a acumular muitos tipos auxiliares (`Payload`, `Record`, `Row`, `Mapper`), extraia esses tipos para arquivos dedicados em `infra/`
* O objetivo é manter a classe do repository enxuta, com foco nas operações de persistência
* Para tipos específicos de uma entidade, prefira nomes como `usuario.types.ts`, `usuario.mapper.ts`, etc.

Aqui podem existir dependências técnicas.

### 3.5 UI (`ui/`)

#### Hooks

Local principal: `ui/hooks`

Exceção oficial:

* Hooks específicos de uma única feature podem ficar co-localizados com a própria feature
* Exemplos válidos: `app/(private)/membros/hooks`, `app/(private)/encontros/hooks`
* Use `ui/hooks` para hooks compartilhados entre múltiplas features ou áreas

Responsabilidades:

* Chamar Server Actions ou APIs
* Gerenciar loading / error / success
* Adaptar dados para UI

Nunca devem:

* Conter regra de negócio
* Criar entidades de domínio
* Instanciar repositories ou services diretamente

#### Contexts

Local: `ui/contexts`

Responsabilidades:

* Estado global de UI
* Sessão, tema, permissões

#### Stores (Redux / Zustand)

Local: `ui/stores`

Responsabilidades:

* Estado compartilhado
* Cache de UI

Nunca substituem Use Cases.

### 3.6 Adapters Next.js (`app/`)

#### API Routes

Local: `app/api/**/route.ts`

Usar quando:

* Existirem consumidores externos
* Precisar de contrato HTTP
* Versionamento for necessário

Função:

* Traduzir HTTP → DTO
* Chamar Use Case
* Traduzir resposta → HTTP

#### Server Actions

Local: `app/actions`

Usar quando:

* CRUD interno da UI
* Forms
* Ações acionadas pelo frontend

Regras:

* Sempre chamar um Use Case
* Nunca conter regra de negócio

#### Decisão arquitetural para CRUDs

* CRUD interno da UI → **Server Actions**
* CRUD exposto / externo → **API Routes**
* Ambos podem coexistir usando o mesmo Use Case

---

## 4. Convenções de Nomenclatura

### 4.1 Arquivos

| Camada | Padrão | Exemplos |
|--------|--------|----------|
| Domain (entidades) | `<entidade>.ts` (kebab-case) | `membro.ts`, `papel-celula.ts`, `membro-celula.ts` |
| Domain (tipos gerais) | `types.ts` | `types.ts` |
| Application (services) | `<entidade>.service.ts` | `membro.service.ts`, `encontro.service.ts` |
| Application (DTOs) | `dtos.ts` | `dtos.ts` |
| Application (mappers) | `mapper.ts` | `mapper.ts` |
| Infra (repositórios) | `<entidade>.repository.ts` | `membro.repository.ts`, `user-profile.repository.ts` |
| Infra (tipos) | `<entidade>.types.ts` | `usuario.types.ts` |
| Infra (mappers) | `mapper.ts` ou `<entidade>.mapper.ts` | `mapper.ts`, `membros-celula.mapper.ts` |
| Server Actions | `index.ts` dentro de pasta da feature | `actions/membros/index.ts` |
| Componentes React | **PascalCase** `.tsx` | `ErrorBox.tsx`, `PrivateShell.tsx` |
| Hooks | **camelCase** com prefixo `use` | `useMembros.ts`, `useEncontros.ts` |

### 4.2 Classes e Tipos

| Artefato | Padrão | Exemplos |
|----------|--------|----------|
| Entidades | `interface` PascalCase | `Membro`, `Encontro`, `Celula` |
| Enums | `enum` PascalCase | `PapelCelula`, `Perfil` |
| Services | `class` PascalCase + `Service` | `MembroService`, `EncontroService` |
| Repositories | `class` PascalCase + `Repository` | `MembroRepository`, `EncontroRepository` |
| DTOs | `interface` PascalCase + `Dto` | `MembroListItemDto`, `CreateMembroDto` |
| Props React | `type Props` (local) | `type Props = { title: string }` |

### 4.3 Propriedades

| Local | Convenção | Exemplo |
|-------|-----------|---------|
| Domínio e DTOs | **camelCase** em português | `criadoEm`, `dataNascimento`, `celulaId` |
| Banco (Supabase rows) | **snake_case** | `criado_em`, `data_nascimento`, `celula_id` |
| Rotas públicas | **kebab-case** em português | `/membros`, `/esqueci-senha`, `/redefinir-senha` |

A conversão entre snake_case (banco) e camelCase (domínio) é responsabilidade exclusiva dos **mappers em `infra/`**.

### 4.4 Imports

| Contexto | Estilo | Exemplo |
|----------|--------|---------|
| Dentro da mesma feature | **Relativo** | `../domain/membro`, `./dtos` |
| Cross-module / shared | **Alias `@/`** | `@/modules/celulas/domain/papel-celula` |
| Server Actions | **Sempre `@/`** | `@/modules/secretaria/application/membro.service` |
| Apenas tipos | **`import type`** | `import type { SupabaseClient } from "@supabase/supabase-js"` |

### 4.5 Exports

* Sempre **named exports** (nunca `export default`, exceto onde Next.js exige em `page.tsx` / `layout.tsx`).

---

## 5. Padrões de Tratamento de Erros

### 5.1 Repositórios (Infra)

* Sempre destruture `{ data, error }` do resultado do Supabase.
* Lance `new Error(error.message)` se `error` existir.
* Para dados não encontrados, lance `new Error("Mensagem descritiva em português")`.
* **Não** use `console.error` - deixe o erro subir para quem chamou.

```typescript
const { data, error } = await this.supabase.from(TABLE).select("*");
if (error) throw new Error(error.message);
```

### 5.2 Services (Application)

* Podem lançar exceções de validação com `new Error("Mensagem descritiva")`.
* Não capturam erros dos repositórios - deixam propagar.

### 5.3 Server Actions

* **Não** adicionam try/catch - erros do service/repository propagam naturalmente via Next.js.

### 5.4 UI (Hooks e Componentes)

* Hooks envolvem chamadas a Server Actions em `try/catch`.
* Usam narrowing com `error instanceof Error ? error.message : "Mensagem padrão"`.
* Armazenam erro em estado local (`setErro`).

```typescript
try {
  const data = await listMembros();
  setMembros(data);
} catch (error) {
  setErro(error instanceof Error ? error.message : "Erro ao carregar membros");
}
```

---

## 6. Padrões Supabase

### 6.1 Criação de Client

| Contexto | Import | Chamada |
|----------|--------|---------|
| Server (Actions, API Routes) | `@/shared/supabase/server` | `const supabase = await createClient()` (async) |
| Client (Hooks, Providers) | `@/shared/supabase/client` | `const supabase = createClient()` (sync, singleton) |

Regras:

* **Nunca** crie o client no escopo do módulo (fora de funções/hooks) - risco de execução durante SSR.
* O client do servidor precisa de `await` (usa `cookies()`). O client do browser é síncrono.
* Repositories recebem `SupabaseClient` via constructor - **não** criam o client internamente.

### 6.2 Queries

* Declare o nome da tabela como constante: `const TABLE = "membros"`.
* Use `.maybeSingle()` quando um resultado pode não existir.
* Use `.single()` quando o resultado **deve** existir (insert/update com `.select()`).
* Aplique `soft delete` com `.eq("deletado", false)` nas listagens.

### 6.3 Autenticação

* Use `supabase.auth.getUser()` (validação server-side) - **nunca** `getSession()` (pode ser spoofada via localStorage).
* Para auditoria (`criado_por`, `atualizado_por`), obtenha o `user.id` na Server Action e passe como parâmetro ao service.

---

## 7. Diretrizes para IA (Cursor / LLM)

Ao criar ou modificar código, a IA deve usar este fluxo:

### 7.1 Antes de gerar código

- [ ] Identificar em qual camada o código deve ficar (`domain`, `application`, `infra`, `app/actions`, `ui`)
- [ ] Verificar se já existe um módulo para a feature ou se é necessário criar um novo
- [ ] Verificar se já existe um service/repository que pode ser reutilizado

### 7.2 Ao implementar

- [ ] Preferir a ordem: Domain → Application (Service + DTOs) → Infra (Repository) → Adapter → UI
- [ ] Seguir as regras de camadas da seção 3
- [ ] Seguir as convenções da seção 4
- [ ] Seguir os padrões de erro da seção 5
- [ ] Seguir os padrões Supabase da seção 6

### 7.3 Antes de concluir

- [ ] O arquivo está na pasta correta segundo a estrutura da seção 2?
- [ ] Nenhum import de React/Next/Supabase existe em `modules/*/domain/`?
- [ ] Nenhum import de React/Next existe em `modules/*/application/`?
- [ ] A Server Action apenas instancia e chama um Service?
- [ ] A UI não instancia repositories ou services diretamente?
- [ ] Propriedades de domínio estão em camelCase (não snake_case)?
- [ ] Exports são **named** (não default, exceto `page.tsx` / `layout.tsx`)?
- [ ] Imports cross-module usam `@/` e imports locais usam `./`?

### 7.4 Regras gerais

1. Preferir simplicidade para um time misto de juniores e seniores
2. Usar interfaces apenas quando houver benefício claro de desacoplamento
3. Reutilizar Use Cases (Services) entre Server Actions e API Routes
4. Perguntar antes de violar qualquer regra aqui definida