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
