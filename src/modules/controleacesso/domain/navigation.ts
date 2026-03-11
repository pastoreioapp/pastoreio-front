import { Perfil } from "./types";

export type AppRoutePath =
  | "/dashboard"
  | "/membros"
  | "/organograma"
  | "/encontros"
  | "/multiplicacao";

export interface RouteAccessConfig {
  title: string;
  href: AppRoutePath;
  allowedRoles: readonly string[];
}

export const LIDER_ONLY_ROLES = [
  Perfil.LIDER_CELULA
] as const;

export const LIDER_AUXILIAR_ROLES = [
  Perfil.LIDER_CELULA,
  Perfil.AUXILIAR_CELULA,
] as const;

export const APP_ROUTE_ACCESS: RouteAccessConfig[] = [
  {
    title: "Central da célula",
    href: "/dashboard",
    allowedRoles: LIDER_ONLY_ROLES,
  },
  {
    title: "Membros",
    href: "/membros",
    allowedRoles: LIDER_AUXILIAR_ROLES,
  },
  {
    title: "Organograma",
    href: "/organograma",
    allowedRoles: LIDER_AUXILIAR_ROLES,
  },
  {
    title: "Encontros",
    href: "/encontros",
    allowedRoles: LIDER_AUXILIAR_ROLES,
  },
  {
    title: "Multiplicação",
    href: "/multiplicacao",
    allowedRoles: LIDER_ONLY_ROLES,
  },
];

export function hasRequiredRole(
  userRoles: readonly string[] | undefined,
  allowedRoles: readonly string[] | undefined,
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  return allowedRoles.some((role) => userRoles.includes(role));
}

export function getAccessibleRouteConfigs(
  userRoles: readonly string[] | undefined,
): RouteAccessConfig[] {
  return APP_ROUTE_ACCESS.filter((route) =>
    hasRequiredRole(userRoles, route.allowedRoles),
  );
}

export function getRouteConfigByPath(
  pathname: string,
): RouteAccessConfig | undefined {
  return APP_ROUTE_ACCESS.find((route) => route.href === pathname);
}
