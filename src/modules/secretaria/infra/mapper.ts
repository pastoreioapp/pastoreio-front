import type { Membro } from "../domain/membro";

export function rowToMembro(row: Record<string, unknown>): Membro {
  return {
    id: Number(row.id),
    userId: String(row.user_id ?? ""),
    nome: row.nome != null ? String(row.nome) : null,
    email: row.email != null ? String(row.email) : null,
    telefone: row.telefone != null ? String(row.telefone) : null,
    dataNascimento: row.data_nascimento != null ? String(row.data_nascimento) : null,
    endereco: row.endereco != null ? String(row.endereco) : null,
    estadoCivil: row.estado_civil != null ? String(row.estado_civil) : null,
    conjuge: row.conjuge != null ? String(row.conjuge) : null,
    filhos: row.filhos != null ? String(row.filhos) : null,
    discipulador: row.discipulador != null ? String(row.discipulador) : null,
    discipulando: row.discipulando != null ? String(row.discipulando) : null,
    ministerio: row.ministerio != null ? String(row.ministerio) : null,
    ativo: Boolean(row.ativo),
    criadoEm: String(row.criado_em),
    criadoPor: String(row.criado_por ?? ""),
    atualizadoEm: row.atualizado_em != null ? String(row.atualizado_em) : null,
    atualizadoPor: row.atualizado_por != null ? String(row.atualizado_por) : null,
    deletado: Boolean(row.deletado),
  };
}

export function membroToRow(m: Partial<Membro>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (m.userId != null) row.user_id = m.userId;
  if (m.nome !== undefined) row.nome = m.nome ?? null;
  if (m.email !== undefined) row.email = m.email ?? null;
  if (m.telefone !== undefined) row.telefone = m.telefone ?? null;
  if (m.dataNascimento !== undefined) row.data_nascimento = m.dataNascimento ?? null;
  if (m.endereco !== undefined) row.endereco = m.endereco ?? null;
  if (m.estadoCivil !== undefined) row.estado_civil = m.estadoCivil ?? null;
  if (m.conjuge !== undefined) row.conjuge = m.conjuge ?? null;
  if (m.filhos !== undefined) row.filhos = m.filhos ?? null;
  if (m.discipulador !== undefined) row.discipulador = m.discipulador ?? null;
  if (m.discipulando !== undefined) row.discipulando = m.discipulando ?? null;
  if (m.ministerio !== undefined) row.ministerio = m.ministerio ?? null;
  if (m.ativo !== undefined) row.ativo = m.ativo;
  if (m.criadoEm != null) row.criado_em = m.criadoEm;
  if (m.criadoPor != null) row.criado_por = m.criadoPor;
  if (m.atualizadoEm !== undefined) row.atualizado_em = m.atualizadoEm ?? null;
  if (m.atualizadoPor !== undefined) row.atualizado_por = m.atualizadoPor ?? null;
  if (m.deletado !== undefined) row.deletado = m.deletado;
  return row;
}
