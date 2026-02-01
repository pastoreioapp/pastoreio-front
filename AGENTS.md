# Arquitetura do Projeto (Next.js Full Stack + Clean Architecture)

Este documento define **regras arquiteturais obrigatórias** do projeto. Ele existe para:

* Garantir consistência técnica
* Evitar acoplamento indevido ao framework
* Facilitar refatorações
* Servir como **fonte de verdade** para humanos e IA (Cursor / LLMs)

**As regras abaixo não são sugestões. São decisões arquiteturais.**

---

## 1. Princípios Fundamentais

### 1.1 Clean Architecture (CA)

O projeto segue Clean Architecture com foco em:

* Regra da dependência
* Isolamento do domínio
* Framework como detalhe
* Código orientado a casos de uso

**Regra de ouro:**

> O domínio não conhece Next.js, React, Supabase ou qualquer framework.

---

### 1.2 Framework como Boundary

* Next.js (`app/`) é apenas um **adapter**
* React é apenas **camada de apresentação**
* Supabase é apenas **infraestrutura**

Nenhuma regra de negócio pode depender diretamente dessas tecnologias.

---

## 2. Estrutura de Pastas Oficial

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
│   ├── hooks/               # Hooks de UI
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

### 3.1 `modules/` (Domínio + Application)

#### Permitido

* Entidades
* Value Objects
* Interfaces (repositórios, gateways)
* Casos de uso

#### Proibido

* React
* Next.js
* Supabase
* Fetch / HTTP
* Hooks
* Contexts

> Código em `modules/` deve ser 100% testável sem framework.

---

### 3.2 Domain (`modules/*/domain`)

Responsabilidades:

* Regras de negócio
* Invariantes
* Validações

Nunca deve:

* Acessar banco
* Conhecer DTOs de UI
* Conhecer formato HTTP

---

### 3.3 Application (`modules/*/application`)

Responsabilidades:

* Orquestrar regras
* Executar fluxos de negócio
* Chamar interfaces definidas no domínio

Nunca deve:

* Importar infraestrutura concreta
* Conhecer React ou Next.js

---

### 3.4 Infra (`modules/*/infra`)

Responsabilidades:

* Implementar interfaces do domínio
* Acesso a banco (Supabase)
* Integrações externas

Aqui podem existir dependências técnicas.

---

## 4. Camada de Apresentação (`ui/`)

### 4.1 Hooks

Local: `ui/hooks`

Responsabilidades:

* Chamar Server Actions ou APIs
* Gerenciar loading / error / success
* Adaptar dados para UI

Nunca devem:

* Conter regra de negócio
* Criar entidades de domínio

---

### 4.2 Contexts

Local: `ui/contexts`

Responsabilidades:

* Estado global de UI
* Sessão, tema, permissões

---

### 4.3 Stores (Redux / Zustand)

Local: `ui/stores`

Responsabilidades:

* Estado compartilhado
* Cache de UI

Nunca substituem Use Cases.

---

## 5. `app/` (Adapters do Next.js)

### 5.1 API Routes

Local: `app/api/**/route.ts`

Usar quando:

* Existirem consumidores externos
* Precisar de contrato HTTP
* Versionamento for necessário

Função:

* Traduzir HTTP → DTO
* Chamar Use Case
* Traduzir resposta → HTTP

---

### 5.2 Server Actions

Local: `app/actions`

Usar quando:

* CRUD interno da UI
* Forms
* Ações acionadas pelo frontend

Regras:

* Sempre chamar um Use Case
* Nunca conter regra de negócio

---

## 6. CRUDs: decisão arquitetural

* CRUD interno da UI → **Server Actions**
* CRUD exposto / externo → **API Routes**
* Ambos podem coexistir usando o mesmo Use Case

---

## 7. Regras de Dependência (Obrigatórias)

```text
UI → Adapters (Server Actions / API)
Adapters → Application (Use Cases)
Application → Domain
Infra → Domain
```

❌ Dependências inversas são proibidas.

---

## 8. Diretrizes para IA (Cursor / LLM)

Ao criar ou modificar código, a IA **deve**:

1. Respeitar esta estrutura
2. Criar Use Cases antes de criar UI
3. Nunca colocar regra de negócio em `app/` ou `ui/`
4. Reutilizar Use Cases entre Server Actions e APIs
5. Perguntar antes de violar qualquer regra aqui definida

---

## 10. Regra Final

> Se amanhã Next.js for removido,
> o domínio deve continuar funcionando sem alterações.

Se isso não for verdade, a implementação está incorreta.