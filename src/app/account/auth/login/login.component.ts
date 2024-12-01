import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { AuthenticationService } from "../services/auth.service";
import { AuthfakeauthenticationService } from "../../../core/services/authfake.service";

import { Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { login } from "src/app/store/Authentication/authentication.actions";
import { ToastrService } from "ngx-toastr";
import { LoginForm } from "../types";

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

  // set the currenr year
  year: number = new Date().getFullYear();

  loginForm: FormGroup<LoginForm> = new FormGroup<LoginForm>({
    userName: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });
  // tslint:disable-next-line: max-line-length
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public toastr: ToastrService
  ) {}

  ngOnInit() {
    if (localStorage.getItem("currentUser")) {
      this.router.navigate(["/"]);
    }
  }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    const userName = this.loginForm.controls.userName.value;
    const password = this.loginForm.controls.password.value;

    // Login Api
    this.authenticationService.login(userName, password).subscribe(
      (response) => {
        this.toastr.success("Registration successful", "Bootstrap");
        localStorage.setItem("currentUser", JSON.stringify(response));
        this.router.navigate(["/"]);
      },
      (error) => {
        let firstErrorMessage =
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
