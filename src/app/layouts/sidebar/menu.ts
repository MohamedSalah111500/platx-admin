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
  {
    id: 2,
    label: "MENUITEMS.CUSTOMER_CONTACT.TEXT",
    icon: "bx-user",
    link: "/customer-contact",
  },
  {
    id: 3,
    label: "MENUITEMS.MANAGEMENT.TEXT",
    icon: "bx-cog",
    subItems: [
      {
        id: 31,
        label: "MENUITEMS.PLANS.TEXT",
        link: "/plans",
        parentId: 3,
      },
      {
        id: 32,
        label: "MENUITEMS.RENEWAL_REQUESTS.TEXT",
        link: "/renewal-requests",
        parentId: 3,
      },
      {
        id: 33,
        label: "MENUITEMS.PAYMENTS_DUE.TEXT",
        link: "/installments",
        parentId: 3,
      },
    ],
  },
];
