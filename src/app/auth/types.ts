import { FormControl } from "@angular/forms";

export interface LoginForm {
  userName: FormControl;
  password: FormControl;
}

export interface ForgetPasswordForm {
  userName: FormControl;
}

export interface ResetPasswordForm {
  email: FormControl;
}

export class User {
  id?: number;
  userName?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  email?: string;
  roles?: string[];
  userId?: string;
}

export interface LoginAPIResponse {
  token: string;
  expiryDateTime: string;
  userId: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  roles: any[];
}
