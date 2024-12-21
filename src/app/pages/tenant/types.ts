import { FormControl } from "@angular/forms";

export interface Tenant {
  lastName: string;
  firstName: string;
  id?: string;
  title?: string;
  domain?: string;
  coverFileId?: null;
  coverFile?: TenantFile;
  logoFileId?: null;
  logoFile?: TenantFile;
  description?: string;
  creationTime?: string;
  createdBy?: null;
  updateTime?: string;
  isActive?: boolean;
}
interface TenantFile {
  id: number;
  name: string;
  size: number;
  url: string;
  fileType: number;
  creationTime: string;
  updateTime: null;
}

export interface TenantFormGroup {
  id: FormControl;
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
