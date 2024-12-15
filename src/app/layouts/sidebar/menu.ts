import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "MENUITEMS.DASHBOARDS.TEXT",
    icon: "bx-home-circle",
    link: "/dashboard",
  },
  {
    id: 2,
    label: "MENUITEMS.MANAGE_TENANT.TEXT",
    icon: "bx-cog",
    link: "/tenant",
  },
  // {
  //   id: 3,
  //   label: "MENUITEMS.MANAGE_INSTANCE.TEXT",
  //   icon: "bx-cog",
  //   link: "/manage/roles",
  // },
];
