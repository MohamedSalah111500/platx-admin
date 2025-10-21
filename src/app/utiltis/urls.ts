import { environment } from "src/environments/environment";

const AUTH_BASE = "api/Auth/";
const TENANT_BASE = "api/Tenant";
const PLATX_CONTACT_BASE = "api/PlatxContact";
const FILE_MANAGER_BASE = "api/Attachements";
const GENERAL_FILE_BASE = "api/Files";
const SUBSCRIPTION_BASE = "api/Subscriptions";
const ADMIN_SUBSCRIPTION_BASE = "api/admin/subscription-plans";


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
};

export const PLATX_CONTACT_URLS = {
  GET_CONTACT: `${environment.apiURL
    .concat(PLATX_CONTACT_BASE)
    .concat("/GetContactDetailsList")}`,
    DELETE: (id: string) => `${environment.apiURL.concat(PLATX_CONTACT_BASE)}/${id}`,
};

export const SUBSCRIPTION_URLS = {
  GET_PLANS: `${environment.apiURL.concat(SUBSCRIPTION_BASE)}/plans`,
  CREATE: `${environment.apiURL.concat(ADMIN_SUBSCRIPTION_BASE)}`,
  UPDATE: (id: string | number) => `${environment.apiURL.concat(ADMIN_SUBSCRIPTION_BASE)}/${id}`,
  DELETE: (id: string | number) => `${environment.apiURL.concat(ADMIN_SUBSCRIPTION_BASE)}/${id}`,
};
