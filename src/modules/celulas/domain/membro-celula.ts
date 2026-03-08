export interface MembroCelula {
  id: number;
  celulaId: number;
  membroId: number;
  papelCelula: string | null;
  dataEntrada: string | null;
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
  deletado: boolean;
}
