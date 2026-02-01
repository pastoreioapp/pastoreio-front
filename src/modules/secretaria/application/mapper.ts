import type { Membro } from "../domain/membro";
import type { MembroListItemDto, MembroDetailDto } from "./dtos";

export function toListItemDto(m: Membro): MembroListItemDto {
  return {
    id: m.id,
    userId: m.userId,
    nome: m.nome,
    funcao: m.ministerio,
    email: m.email,
    telefone: m.telefone,
    dataNascimento: m.dataNascimento,
    endereco: m.endereco,
    estadoCivil: m.estadoCivil,
    conjuge: m.conjuge,
    filhos: m.filhos,
    discipulador: m.discipulador,
    discipulando: m.discipulando,
    ministerio: m.ministerio,
    ativo: m.ativo,
  };
}

export function toDetailDto(m: Membro): MembroDetailDto {
  return {
    id: m.id,
    userId: m.userId,
    nome: m.nome,
    funcao: m.ministerio,
    email: m.email,
    telefone: m.telefone,
    dataNascimento: m.dataNascimento,
    endereco: m.endereco,
    estadoCivil: m.estadoCivil,
    conjuge: m.conjuge,
    filhos: m.filhos,
    discipulador: m.discipulador,
    discipulando: m.discipulando,
    ministerio: m.ministerio,
    ativo: m.ativo,
    criadoEm: m.criadoEm,
    criadoPor: m.criadoPor,
    atualizadoEm: m.atualizadoEm,
    atualizadoPor: m.atualizadoPor,
  };
}
