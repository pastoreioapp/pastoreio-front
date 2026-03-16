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

**Concessão adotada para este projeto:**

> A camada de `application` pode depender diretamente de repositórios concretos da camada `infra` pois isso simplifica o entendimento e a manutenção do código para a equipe.
> O isolamento obrigatório continua sendo do `domain`, que não deve conhecer infraestrutura.

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

### 3.1 `modules/` (Domínio + Application)

#### Permitido

* Entidades
* Value Objects
* Casos de uso
* Repositórios concretos chamados pela camada de `application`
* Interfaces (repositórios, gateways) quando fizer sentido

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
* Chamar repositórios da própria feature
* Opcionalmente usar interfaces quando houver ganho real de desacoplamento

Nunca deve:

* Conhecer React ou Next.js

Pode:

* Importar repositórios concretos de `infra/` da mesma feature
* Manter a orquestração principal do caso de uso fora de `app/` e `ui/`

---

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

---

## 4. Camada de Apresentação (`ui/`)

### 4.1 Hooks

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
Application → Infra e/ou Domain
Infra → Domain (quando necessário)
```

❌ Dependências inversas são proibidas.

---

## 8. Diretrizes para IA (Cursor / LLM)

Ao criar ou modificar código, a IA **deve**:

1. Respeitar esta estrutura
2. Criar Use Cases antes de criar UI
3. Nunca colocar regra de negócio em `app/` ou `ui/`
4. Reutilizar Use Cases entre Server Actions e APIs
5. Preferir simplicidade para um time misto de juniores e sêniors
6. Usar interfaces apenas quando houver benefício claro de desacoplamento, teste ou múltiplas implementações
7. Perguntar antes de violar qualquer regra aqui definida

---

## 10. Regra Final

> Se amanhã Next.js for removido,
> o domínio deve continuar funcionando sem alterações.

Se isso não for verdade, a implementação está incorreta.