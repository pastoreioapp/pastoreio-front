import {
    IconAperture,
    IconCopy,
    IconLayoutDashboard,
    IconLogin,
    IconMoodHappy,
    IconTypography,
    IconUserPlus,
    IconHome,
    IconUser,
    IconCalendar,
    IconUsersGroup,
} from "@tabler/icons-react";
import { uniqueId } from "lodash";

export const Menuitems = [
    {
        id: uniqueId(),
        title: "Página Inicial",
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
        title: "Encontros",
        icon: IconCalendar,
        href: "/encontros",
    },
    {
        id: uniqueId(),
        title: "Multiplicação",
        icon: IconUsersGroup,
        href: "/multiplicacao",
    },
    // {
    //     navlabel: true,
    //     subheader: "Home",
    // },
    // {
    //     id: uniqueId(),
    //     title: "Dashboard",
    //     icon: IconLayoutDashboard,
    //     href: "/dashboard",
    // },
    // {
    //     navlabel: true,
    //     subheader: "Utilities",
    // },
    // {
    //     id: uniqueId(),
    //     title: "Typography",
    //     icon: IconTypography,
    //     href: "/utilities/typography",
    // },
    // {
    //     id: uniqueId(),
    //     title: "Shadow",
    //     icon: IconCopy,
    //     href: "/utilities/shadow",
    // },
    // {
    //     navlabel: true,
    //     subheader: "Auth",
    // },
    // {
    //     id: uniqueId(),
    //     title: "Login",
    //     icon: IconLogin,
    //     href: "/auth/login",
    // },
    // {
    //     id: uniqueId(),
    //     title: "Register",
    //     icon: IconUserPlus,
    //     href: "/auth/register",
    // },
    // {
    //     navlabel: true,
    //     subheader: "Extra",
    // },
    // {
    //     id: uniqueId(),
    //     title: "Icons",
    //     icon: IconMoodHappy,
    //     href: "/icons",
    // },
    // {
    //     id: uniqueId(),
    //     title: "Sample Page",
    //     icon: IconAperture,
    //     href: "/sample-page",
    // },
];
