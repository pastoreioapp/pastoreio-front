# Server Actions

Server Actions são **adapters finos** entre a UI e os Services (use cases) dos módulos. Nenhuma regra de negócio deve existir aqui.

## Estrutura

```
actions/
├── membros/
│   └── index.ts       # listMembros, createMembro, updateMembro, deleteMembro
├── encontros/
│   └── index.ts       # listEncontros, createEncontro, ...
├── celulas/
│   └── index.ts       # listCelulas, listMembrosDaCelula, ...
└── README.md
```

Cada feature tem **uma pasta** com um **`index.ts`** que exporta todas as actions.

## Regras

1. Toda action começa com `"use server";` na primeira linha.
2. Toda action chama um **Service** — nunca acessa repositórios ou Supabase diretamente.
3. Use o client Supabase de `@/shared/supabase/server` (server-side, async).
4. Imports usam **sempre** o alias `@/` (nunca relativos).
5. **Não** adicione try/catch — erros propagam naturalmente via Next.js.
6. Para auditoria (`criado_por`, `atualizado_por`), obtenha o `user.id` via `getAuditUserId()`.

## Template

```typescript
"use server";

import type { Entidade } from "@/modules/<feature>/domain/entidade";
import type { CreateEntidadeDto } from "@/modules/<feature>/application/dtos";
import { EntidadeService } from "@/modules/<feature>/application/entidade.service";
import { EntidadeRepository } from "@/modules/<feature>/infra/entidade.repository";
import { createClient } from "@/shared/supabase/server";

async function getService(): Promise<EntidadeService> {
    const supabase = await createClient();
    const repo = new EntidadeRepository(supabase);
    return new EntidadeService(repo);
}

async function getAuditUserId(): Promise<string> {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? "";
}

export async function listEntidades(): Promise<Entidade[]> {
    const service = await getService();
    return service.list();
}

export async function createEntidade(dto: CreateEntidadeDto): Promise<Entidade> {
    const [service, userId] = await Promise.all([getService(), getAuditUserId()]);
    return service.create(dto, userId);
}

export async function deleteEntidade(id: number): Promise<void> {
    const service = await getService();
    return service.delete(id);
}
```

## Convenções de nomes

- Funções: `camelCase` com verbo + entidade no plural quando listar (`listMembros`, `createMembro`, `deleteMembro`).
- Retornos: sempre tipar explicitamente (`Promise<Membro[]>`, `Promise<MembroListItemDto>`).
