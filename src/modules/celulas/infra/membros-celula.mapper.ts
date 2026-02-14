import type { MembroListItemDto } from "@/modules/secretaria/application/dtos";

type MembrosCelulaRow = {
  id: number;
  celula_id: number;
  membro_id: number;
  papel_celula: string | null;
  data_entrada: string | null;
  deletado: boolean;
  membros: {
    id: number;
    user_id: string | null;
    nome: string | null;
    email: string | null;
    telefone: string | null;
    data_nascimento: string | null;
    endereco: string | null;
    estado_civil: string | null;
    conjuge: string | null;
    filhos: string | null;
    discipulador: string | null;
    discipulando: string | null;
    ministerio: string | null;
    ativo: boolean;
    deletado: boolean;
  } | null;
};

export function rowToMembroListItemDto(row: MembrosCelulaRow): MembroListItemDto {
  const m = row.membros;
  if (!m) {
    return {
      id: row.membro_id,
      userId: "",
      nome: null,
      funcao: row.papel_celula ?? null,
      email: null,
      telefone: null,
      dataNascimento: null,
      endereco: null,
      estadoCivil: null,
      conjuge: null,
      filhos: null,
      discipulador: null,
      discipulando: null,
      ministerio: null,
      ativo: false,
    };
  }
  return {
    id: m.id,
    userId: m.user_id != null ? String(m.user_id) : "",
    nome: m.nome != null ? String(m.nome) : null,
    funcao: row.papel_celula ?? null,
    email: m.email != null ? String(m.email) : null,
    telefone: m.telefone != null ? String(m.telefone) : null,
    dataNascimento: m.data_nascimento != null ? String(m.data_nascimento) : null,
    endereco: m.endereco != null ? String(m.endereco) : null,
    estadoCivil: m.estado_civil != null ? String(m.estado_civil) : null,
    conjuge: m.conjuge != null ? String(m.conjuge) : null,
    filhos: m.filhos != null ? String(m.filhos) : null,
    discipulador: m.discipulador != null ? String(m.discipulador) : null,
    discipulando: m.discipulando != null ? String(m.discipulando) : null,
    ministerio: m.ministerio != null ? String(m.ministerio) : null,
    ativo: Boolean(m.ativo),
  };
}
