import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/auth.service";

type Step = "email" | "code" | "password";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
})
export class ForgotPasswordComponent {
  step: Step = "email";
  loading = false;
  error = "";
  fieldTextType = false;
  year: number = new Date().getFullYear();
  private resetToken = "";

  emailControl = new FormControl("", [Validators.required, Validators.email]);
  codeControl = new FormControl("", [Validators.required]);
  passwordForm = new FormGroup({
    password: new FormControl("", [Validators.required]),
    confirmPassword: new FormControl("", [Validators.required]),
  });

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  sendCode(): void {
    if (this.emailControl.invalid || this.loading) return;
    this.run(this.auth.forgotPassword(this.email), () => {
      this.toastr.success(this.translate.instant("AUTH.FORGOT.CODE_SENT"));
      this.step = "code";
    });
  }

  verifyCode(): void {
    if (this.codeControl.invalid || this.loading) return;
    this.run(this.auth.verifyResetCode(this.email, this.codeControl.value!.trim()), (response) => {
      this.resetToken = response.token;
      this.step = "password";
    });
  }

  resetPassword(): void {
    if (this.passwordForm.invalid || this.loading) return;
    const { password, confirmPassword } = this.passwordForm.getRawValue();
    if (password !== confirmPassword) {
      this.error = this.translate.instant("AUTH.FORGOT.MISMATCH");
      return;
    }
    this.run(this.auth.resetPassword(this.resetToken, password!, confirmPassword!), () => {
      this.toastr.success(this.translate.instant("AUTH.FORGOT.DONE"));
      this.router.navigate(["/auth/login"]);
    });
  }

  private get email(): string {
    return this.emailControl.value!.trim();
  }

  private run<T>(request: Observable<T>, onSuccess: (response: T) => void): void {
    this.loading = true;
    this.error = "";
    request.subscribe({
      next: (response) => {
        this.loading = false;
        onSuccess(response);
      },
      error: (err) => {
        this.loading = false;
        this.error = this.messageOf(err);
      },
    });
  }

  private messageOf(err: any): string {
    const validationErrors = err?.error?.errors;
    if (validationErrors && typeof validationErrors === "object") {
      const first = Object.values(validationErrors)[0];
      const message = Array.isArray(first) ? first[0] : first;
      if (typeof message === "string" && message.trim()) return message;
    }
    const serverMessage = err?.error?.message;
    if (typeof serverMessage === "string" && serverMessage.trim()) return serverMessage;
    return this.translate.instant("AUTH.FORGOT.FAILED");
  }
}
