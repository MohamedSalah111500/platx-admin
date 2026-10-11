import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { CrmPageAccessService } from "src/app/core/services/crm-page-access.service";
import { UserService } from "src/app/core/services/user.service";
import { AuthenticationService } from "../services/auth.service";
import { LoginForm } from "../types";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  submitted = false;
  loading = false;
  error = "";
  fieldTextType = false;
  year: number = new Date().getFullYear();

  loginForm: FormGroup<LoginForm> = new FormGroup<LoginForm>({
    userName: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    public toastr: ToastrService,
    private translate: TranslateService,
    private pageAccess: CrmPageAccessService
  ) {}

  onSubmit(): void {
    this.submitted = true;
    this.error = "";
    if (this.loginForm.invalid || this.loading) return;

    const { userName, password } = this.loginForm.value;
    this.loading = true;

    this.authenticationService.login(userName, password, "mohamed-salah").subscribe({
      next: (response) => {
        this.toastr.success(this.translate.instant("AUTH.SUCCESS"));
        localStorage.setItem("currentUser", JSON.stringify(response));
        this.userService.saveUserDataInLocalStorage(response);
        const roles: string[] = response.roles || [];
        const landing = roles.includes("SuperAdmin") ? "/dashboard" : "/crm/leads";
        // The menu and the guards read the granted pages, so they have to be in
        // place before the first screen renders.
        this.pageAccess.load().subscribe({
          next: () => this.router.navigate([landing]),
          error: () => this.router.navigate([landing]),
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = this.messageOf(err);
      },
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
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

    return this.translate.instant("AUTH.FAILED");
  }
}
