import { PlatformRequest } from "src/app/shared/platform-request";

export interface GetAllCustomerContactsResponse {
  items: CustomerContact[];
  totalCount: number;
}

export interface CustomerContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  massage: string;
  isDemo: boolean;
  // Preferred date & time chosen by the visitor when booking a free consultation.
  // Null/absent for plain demo requests and general inquiries.
  preferredDate?: string | null;
  createdAt?: string;
  platformRequest?: PlatformRequest | null;
  createdTenantId?: string | null;
}

export interface CreatePlatformFromContactState {
  contactId: string;
  name: string;
  email: string;
  phone: string;
  platformRequest: PlatformRequest;
}
