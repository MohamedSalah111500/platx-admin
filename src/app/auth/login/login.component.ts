import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../services/auth.service";

import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LoginForm } from "../types";
import { el } from "@fullcalendar/core/internal-common";
import { UserService } from "src/app/core/services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  submitted: any = false;
  error: any = "";
  returnUrl: string;
  fieldTextType!: boolean;
  year: number = new Date().getFullYear();

  loginForm: FormGroup<LoginForm> = new FormGroup<LoginForm>({
    userName: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });
  // tslint:disable-next-line: max-line-length
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    public toastr: ToastrService
  ) {}

  ngOnInit() {}

  onSubmit(): void {
    this.submitted = true;
    const { userName, password } = this.loginForm.value;
    let pathname = window.location.pathname;
    const extractedDomain = pathname.split("/")[1];

    this.authenticationService
      .login(userName, password, '')
      .subscribe(
        (response) => {

            this.toastr.success("Login successful", "Bootstrap");
            localStorage.setItem("currentUser", JSON.stringify(response));
            this.userService.saveUserDataInLocalStorage(response);
            this.router.navigate(["/dashboard"]);
        },
        (error) => {
          const firstErrorMessage =
            error?.error?.errors[Object.keys(error.error.errors)[0]];
          this.error = firstErrorMessage;
        }
      );
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
