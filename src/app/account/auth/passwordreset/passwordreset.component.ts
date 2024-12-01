import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthenticationService } from "../services/auth.service";
import { environment } from "../../../../environments/environment";
import { ForgetPasswordForm, ResetPasswordForm } from "../types";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-passwordreset",
  templateUrl: "./passwordreset.component.html",
  styleUrls: ["./passwordreset.component.scss"],
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit, AfterViewInit {
  submitted: any = false;
  error: any = "";
  success: any = "";
  loading: any = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  resetPasswordForm: FormGroup<ResetPasswordForm> = new FormGroup<ResetPasswordForm>({
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  forgetPasswordForm: FormGroup<ForgetPasswordForm> = new FormGroup<ForgetPasswordForm>({
    userName: new FormControl("", [Validators.required]),
  });
  // tslint:disable-next-line: max-line-length
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public toastr: ToastrService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  // convenience getter for easy access to form fields

  /**
   * On submit form
   */
  onSubmit() {
    this.success = "";
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgetPasswordForm.invalid) {
      return;
    }

    const userName = this.forgetPasswordForm.controls.userName.value;
    this.authenticationService.forgetPassword(userName).subscribe(
      (response) => {
        console.log(response);
        this.toastr.success("Rest Password successful", "Bootstrap");
      },
      (error) => {
        let firstErrorMessage =
          error?.error?.errors[Object.keys(error.error.errors)[0]];
        this.error = firstErrorMessage;
      }
    );

    // const email = this.resetPasswordForm.controls.email.value;

    // Login Api
    // this.authenticationService.resetPassword(email).subscribe(
    //   (response) => {
    //     console.log(response)
    //     this.toastr.success("Rest Password successful", "Bootstrap");
    //   },
    //   (error) => {
    //     let firstErrorMessage = error?.error?.errors[Object.keys(error.error.errors)[0]];
    //     this.error = firstErrorMessage;
    //   }
    // );
  }
}
