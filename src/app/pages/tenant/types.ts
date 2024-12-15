import { FormControl } from "@angular/forms";

export interface Tenant {
  lastName: string;
  firstName: string;
  id?: string;
  title?: string;
  domain?: string;
  coverFileId?: null;
  coverFile?: null;
  logoFileId?: null;
  logoFile?: null;
  description?: string;
  creationTime?: string;
  createdBy?: null;
  updateTime?: string;
  isActive?: boolean;
}

export interface TenantFormGroup {
  LastName: FormControl;
  FirstName: FormControl;
  Domain: FormControl;
  LogoFile: FormControl;
  IsActive: FormControl;
  CoverFile: FormControl;
  Title: FormControl;
  Password: FormControl;
  Email: FormControl;
  Description: FormControl;
  CreatedBy: FormControl;
}

export interface GetAllTenantsResponse {
  items: Tenant[];
  totalCount: number;
}
