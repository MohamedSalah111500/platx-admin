// role.model.ts

import { FormControl } from "@angular/forms";

export interface Role {
  id: number;
  name: string;
  creationTime: string;
  updateTime: string | null;
}

export interface GetAllRolesResponse {
  items: Role[];
  totalCount: number;
}

export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  id?: number;
  name: string;
}

export interface RoleForm {
  id?: FormControl<number>;
  name: FormControl<string>;
}


export interface GetAllStudentsResponse {
  items: Student[];
  totalCount: number;
}

export interface Student {
  id?:string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  enrollment: string;
  address: string;
  phoneNumber: string;
  emergencyContact: string;
  grades: string;
  userId: string;
  profileImage: string;
  groups?:Group[]
}

interface Group{
  id: number;
  description: string;
  icon: string;
  nextDueDate: string;
  nextDueTime: string;
  status: number;
  studentsIcons: string[];
}
export interface GetAllStaffsResponse {
  items: Staff[];
  totalCount: number;
}

export interface Staff {
  id?:string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  emergencyContact: string;
  userId: string;
  profileImage: string;
  subjectsTaught?: string;
  groups?:Group[]
  password?: string;

}
