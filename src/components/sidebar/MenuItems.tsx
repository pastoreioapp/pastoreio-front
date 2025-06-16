import {
  IconHome,
  IconUser,
  IconLayoutDashboard,
  IconMessage2,
  IconUsersGroup,
} from "@tabler/icons-react";
import { uniqueId } from "lodash";
import React from "react";

export interface MenuItemType {
  id: string;
  title: string;
  icon: React.ElementType<{
    size?: string | number;
    stroke?: string | number;
    variant?: string;
  }>;
  href: string;
}

export const Menuitems: MenuItemType[] = [
  {
    id: uniqueId(),
    title: "Central da célula",
    icon: IconHome,
    href: "/dashboard",
  },
  {
    id: uniqueId(),
    title: "Membros",
    icon: IconUser,
    href: "/membros",
  },
  {
    id: uniqueId(),
    title: "Orgonograma",
    icon: IconLayoutDashboard,
    href: "/orgonograma",
  },
  {
    id: uniqueId(),
    title: "Encontros",
    icon: IconMessage2,
    href: "/encontros",
  },
  {
    id: uniqueId(),
    title: "Multiplicação",
    icon: IconUsersGroup,
    href: "/multiplicacao",
  },
];
