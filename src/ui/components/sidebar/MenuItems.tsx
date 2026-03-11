import {
  IconHome,
  IconUser,
  IconLayoutDashboard,
  IconMessage2,
  IconUsersGroup,
} from "@tabler/icons-react";
import {
  APP_ROUTE_ACCESS,
  AppRoutePath,
  hasRequiredRole,
  type RouteAccessConfig,
} from "@/modules/controleacesso/domain/navigation";
import React from "react";

type MenuIconType = React.ElementType<{
  size?: string | number;
  stroke?: string | number;
  variant?: string;
}>;

export interface MenuItemType extends RouteAccessConfig {
  id: string;
  icon: MenuIconType;
}

const MENU_ITEM_ICONS: Record<AppRoutePath, MenuIconType> = {
  "/dashboard": IconHome,
  "/membros": IconUser,
  "/organograma": IconLayoutDashboard,
  "/encontros": IconMessage2,
  "/multiplicacao": IconUsersGroup,
};

export const Menuitems: MenuItemType[] = APP_ROUTE_ACCESS.map((route) => ({
  id: route.href,
  title: route.title,
  href: route.href,
  allowedRoles: route.allowedRoles,
  icon: MENU_ITEM_ICONS[route.href],
}));

export function getAccessibleMenuItems(
  userRoles: readonly string[] | undefined,
): MenuItemType[] {
  return Menuitems.filter((item) =>
    hasRequiredRole(userRoles, item.allowedRoles),
  );
}

export function getAccessibleMenuItemByPath(
  pathname: string,
  userRoles: readonly string[] | undefined,
): MenuItemType | undefined {
  return getAccessibleMenuItems(userRoles).find((item) => item.href === pathname);
}
