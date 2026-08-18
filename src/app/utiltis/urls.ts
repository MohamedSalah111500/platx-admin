import { environment } from "src/environments/environment";

const AUTH_BASE = "api/Auth/";
const TENANT_BASE = "api/Tenant";
const PLATX_CONTACT_BASE = "api/PlatxContact";
const FILE_MANAGER_BASE = "api/Attachements";
const GENERAL_FILE_BASE = "api/Files";
const SUBSCRIPTION_PLANS_BASE = "api/admin/subscription-plans";
const TENANT_SUBSCRIPTIONS_BASE = "api/TenantSubscriptions";
const RENEWAL_REQUESTS_BASE = "api/RenewalRequests";
const TENANT_INSTALLMENTS_BASE = "api/TenantInstallments";
const SUBSCRIPTION_LIMITS_BASE = "api/SubscriptionLimits";
const COMPANY_ANALYTICS_BASE = "api/admin/CompanyAnalytics";


export const AUTH_URLS = {
  LOGIN: `${environment.apiURL.concat(AUTH_BASE)}login`,
  REGISTRATION: `${environment.apiURL.concat(AUTH_BASE)}register`,
  FORGOT_PASSWORD: `${environment.apiURL.concat(AUTH_BASE)}forgot-password`,
  RESET_PASSWORD: `${environment.apiURL.concat(AUTH_BASE)}reset-password`,
};


export const FILE_MANAGER_URLS = {
  CREATE: `${environment.apiURL.concat(FILE_MANAGER_BASE)}`,
  CREATE_GENERAL_FILE: `${environment.apiURL.concat(GENERAL_FILE_BASE)}`,
  GET_ALL: `${environment.apiURL.concat(FILE_MANAGER_BASE)}`,
  GET_SIZE: `${environment.apiURL.concat(
    FILE_MANAGER_BASE
  )}/GetAttachementsSize`,
  UPDATE: `${environment.apiURL.concat(FILE_MANAGER_BASE)}`,
  GET_DOWNLOAD_FILE: (id: number) =>
    `${environment.apiURL.concat(FILE_MANAGER_BASE)}/DownloadFile/${id}`,
  DELETE: (id: string) =>
    `${environment.apiURL.concat(FILE_MANAGER_BASE)}/${id}`,
};

export const TENANT_URLS = {
  CREATE: `${environment.apiURL.concat(TENANT_BASE)}`,
  GET_ALL: `${environment.apiURL.concat(TENANT_BASE)}`,
  UPDATE: `${environment.apiURL.concat(TENANT_BASE)}`,
  GET_BY_ID: (id: string) => `${environment.apiURL.concat(TENANT_BASE)}/${id}`,
  DELETE: (id: string) => `${environment.apiURL.concat(TENANT_BASE)}/${id}`,
  ACTIVATE: (id: string) =>
    `${environment.apiURL.concat(TENANT_BASE)}/ActivateTenant/${id}`,
  DEACTIVATE: (id: string) =>
    `${environment.apiURL.concat(TENANT_BASE)}/DeActivateTenant/${id}`,
  UPDATE_QUOTA: () =>
    `${environment.apiURL.concat(TENANT_BASE)}/UpdateTenantQuotaAI`,
  FULL_DELETE: (id: string) =>
    `${environment.apiURL.concat(TENANT_BASE)}/full-delete/${id}`,
};

export const SUBSCRIPTION_PLANS_URLS = {
  GET_ALL: `${environment.apiURL.concat(SUBSCRIPTION_PLANS_BASE)}`,
  GET_BY_ID: (id: number) => `${environment.apiURL.concat(SUBSCRIPTION_PLANS_BASE)}/${id}`,
  CREATE: `${environment.apiURL.concat(SUBSCRIPTION_PLANS_BASE)}`,
  UPDATE: (id: number) => `${environment.apiURL.concat(SUBSCRIPTION_PLANS_BASE)}/${id}`,
  DELETE: (id: number) => `${environment.apiURL.concat(SUBSCRIPTION_PLANS_BASE)}/${id}`,
};

export const TENANT_SUBSCRIPTIONS_URLS = {
  GET_CURRENT: (tenantId: string) =>
    `${environment.apiURL.concat(TENANT_SUBSCRIPTIONS_BASE)}/tenant/${tenantId}/current`,
  GET_HISTORY: (tenantId: string) =>
    `${environment.apiURL.concat(TENANT_SUBSCRIPTIONS_BASE)}/tenant/${tenantId}/history`,
  ASSIGN: (tenantId: string) =>
    `${environment.apiURL.concat(TENANT_SUBSCRIPTIONS_BASE)}/tenant/${tenantId}/assign`,
  EXTEND: (subscriptionId: number) =>
    `${environment.apiURL.concat(TENANT_SUBSCRIPTIONS_BASE)}/${subscriptionId}/extend`,
};

export const TENANT_INSTALLMENTS_URLS = {
  GET_BY_TENANT: (tenantId: string) =>
    `${environment.apiURL.concat(TENANT_INSTALLMENTS_BASE)}/tenant/${tenantId}`,
  CREATE: (tenantId: string) =>
    `${environment.apiURL.concat(TENANT_INSTALLMENTS_BASE)}/tenant/${tenantId}`,
  UPDATE: (id: number) => `${environment.apiURL.concat(TENANT_INSTALLMENTS_BASE)}/${id}`,
  DELETE: (id: number) => `${environment.apiURL.concat(TENANT_INSTALLMENTS_BASE)}/${id}`,
  MARK_PAID: (id: number) => `${environment.apiURL.concat(TENANT_INSTALLMENTS_BASE)}/${id}/mark-paid`,
  MARK_UNPAID: (id: number) => `${environment.apiURL.concat(TENANT_INSTALLMENTS_BASE)}/${id}/mark-unpaid`,
  GET_DUE: `${environment.apiURL.concat(TENANT_INSTALLMENTS_BASE)}/due`,
  SET_TOTAL_AMOUNT: (tenantId: string) =>
    `${environment.apiURL.concat(TENANT_INSTALLMENTS_BASE)}/tenant/${tenantId}/total-amount`,
};

export const RENEWAL_REQUESTS_URLS = {
  GET_PAGED: `${environment.apiURL.concat(RENEWAL_REQUESTS_BASE)}`,
  GET_BY_ID: (id: number) => `${environment.apiURL.concat(RENEWAL_REQUESTS_BASE)}/${id}`,
  HANDLE: (id: number) => `${environment.apiURL.concat(RENEWAL_REQUESTS_BASE)}/${id}/handle`,
};

export const SUBSCRIPTION_LIMITS_URLS = {
  DEFINITIONS: `${environment.apiURL.concat(SUBSCRIPTION_LIMITS_BASE)}/definitions`,
  PLAN_LIMITS: (planId: number) => `${environment.apiURL.concat(SUBSCRIPTION_LIMITS_BASE)}/plans/${planId}`,
  TENANT_DASHBOARD: (tenantId: string) => `${environment.apiURL.concat(SUBSCRIPTION_LIMITS_BASE)}/tenants/${tenantId}/dashboard`,
  TENANT_OVERRIDES: (tenantId: string) => `${environment.apiURL.concat(SUBSCRIPTION_LIMITS_BASE)}/tenants/${tenantId}/overrides`,
  SET_OVERRIDE: `${environment.apiURL.concat(SUBSCRIPTION_LIMITS_BASE)}/tenants/overrides`,
  REMOVE_OVERRIDE: (tenantId: string, key: string) =>
    `${environment.apiURL.concat(SUBSCRIPTION_LIMITS_BASE)}/tenants/${tenantId}/overrides/${key}`,
};

export const PLATX_CONTACT_URLS = {
  GET_CONTACT: `${environment.apiURL
    .concat(PLATX_CONTACT_BASE)
    .concat("/GetContactDetailsList")}`,
    DELETE: (id: string) => `${environment.apiURL.concat(PLATX_CONTACT_BASE)}/${id}`,
};

export const COMPANY_ANALYTICS_URLS = {
  OVERVIEW: `${environment.apiURL.concat(COMPANY_ANALYTICS_BASE)}/overview`,
  GROWTH: (months: number) =>
    `${environment.apiURL.concat(COMPANY_ANALYTICS_BASE)}/growth?months=${months}`,
  ACTIVITY: `${environment.apiURL.concat(COMPANY_ANALYTICS_BASE)}/activity`,
  ENGAGEMENT: (recentTake: number, topTake: number) =>
    `${environment.apiURL.concat(COMPANY_ANALYTICS_BASE)}/engagement?recentTake=${recentTake}&topTake=${topTake}`,
  REVENUE: `${environment.apiURL.concat(COMPANY_ANALYTICS_BASE)}/revenue`,
  TENANT_STATS: `${environment.apiURL.concat(COMPANY_ANALYTICS_BASE)}/tenant-stats`,
};
