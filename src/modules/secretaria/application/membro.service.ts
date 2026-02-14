import type { Membro } from "../domain/membro";
import type { MembroRepository } from "../infra/membro.repository";
import type { MembroListItemDto, MembroDetailDto, CreateMembroDto, UpdateMembroDto } from "./dtos";
import { toListItemDto, toDetailDto } from "./mapper";

export class MembroService {
  constructor(private repo: MembroRepository) {}

  async list(): Promise<MembroListItemDto[]> {
    const list = await this.repo.findAll();
    return list.map(toListItemDto);
  }

  async get(id: number): Promise<MembroDetailDto | null> {
    const membro = await this.repo.findById(id);
    return membro ? toDetailDto(membro) : null;
  }

  async create(dto: CreateMembroDto, criadoPor: string): Promise<Membro> {
    const now = new Date().toISOString();
    const membro: Membro = {
      id: 0,
      userId: dto.userId,
      nome: dto.nome ?? null,
      email: dto.email ?? null,
      telefone: dto.telefone ?? null,
      dataNascimento: dto.dataNascimento ?? null,
      endereco: dto.endereco ?? null,
      estadoCivil: dto.estadoCivil ?? null,
      conjuge: dto.conjuge ?? null,
      filhos: dto.filhos ?? null,
      discipulador: dto.discipulador ?? null,
      discipulando: dto.discipulando ?? null,
      ministerio: dto.ministerio ?? null,
      ativo: dto.ativo,
      criadoEm: now,
      criadoPor,
      atualizadoEm: null,
      atualizadoPor: null,
      deletado: false,
    };
    return this.repo.save(membro);
  }

  async update(id: number, dto: UpdateMembroDto, atualizadoPor: string): Promise<void> {
    const membro = await this.repo.findById(id);
    if (!membro) return;

    const now = new Date().toISOString();
    await this.repo.save({
      ...membro,
      nome: dto.nome !== undefined ? dto.nome : membro.nome,
      email: dto.email !== undefined ? dto.email : membro.email,
      telefone: dto.telefone !== undefined ? dto.telefone : membro.telefone,
      dataNascimento: dto.dataNascimento !== undefined ? dto.dataNascimento : membro.dataNascimento,
      endereco: dto.endereco !== undefined ? dto.endereco : membro.endereco,
      estadoCivil: dto.estadoCivil !== undefined ? dto.estadoCivil : membro.estadoCivil,
      conjuge: dto.conjuge !== undefined ? dto.conjuge : membro.conjuge,
      filhos: dto.filhos !== undefined ? dto.filhos : membro.filhos,
      discipulador: dto.discipulador !== undefined ? dto.discipulador : membro.discipulador,
      discipulando: dto.discipulando !== undefined ? dto.discipulando : membro.discipulando,
      ministerio: dto.ministerio !== undefined ? dto.ministerio : membro.ministerio,
      ativo: dto.ativo !== undefined ? dto.ativo : membro.ativo,
      atualizadoEm: now,
      atualizadoPor,
    });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
