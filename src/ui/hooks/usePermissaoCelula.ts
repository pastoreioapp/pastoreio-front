"use client";

import { PapelCelula } from "@/modules/celulas/domain/papel-celula";
import { useAppAuthentication } from "./useAppAuthentication";

export function usePermissaoCelula() {
  const { loggedUser } = useAppAuthentication();
  const papelCelula = loggedUser?.papelCelula;

  const podeEditarDados = papelCelula === PapelCelula.LIDER_CELULA;
  const podeRegistrarAvancos =
    papelCelula === PapelCelula.LIDER_CELULA ||
    papelCelula === PapelCelula.AUXILIAR_CELULA;

  return {
    papelCelula,
    celulaId: loggedUser?.celulaId ?? null,
    podeEditarDados,
    podeRegistrarAvancos,
    ready: !!loggedUser?.id,
  };
}
