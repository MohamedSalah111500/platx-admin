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
    id: 4,
    label: "MENUITEMS.CRM.TEXT",
    icon: "bx-briefcase-alt-2",
    roles: ["SuperAdmin", "CrmAgent"],
    subItems: [
      {
        id: 41,
        label: "MENUITEMS.CRM_LEADS.TEXT",
        link: "/crm/leads",
        parentId: 4,
        roles: ["SuperAdmin", "CrmAgent"],
      },
      {
        id: 42,
        label: "MENUITEMS.CRM_PIPELINE.TEXT",
        link: "/crm/pipeline",
        parentId: 4,
        roles: ["SuperAdmin", "CrmAgent"],
      },
      {
        id: 43,
        label: "MENUITEMS.CRM_TEAM.TEXT",
        link: "/crm/team",
        parentId: 4,
        roles: ["SuperAdmin"],
      },
    ],
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
