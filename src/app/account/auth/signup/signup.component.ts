import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthenticationService } from "../services/auth.service";
import { environment } from "../../../../environments/environment";
import { first } from "rxjs/operators";
import { UserProfileService } from "../../../core/services/user.service";
import { Store } from "@ngrx/store";
import { Register } from "src/app/store/Authentication/authentication.actions";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: UntypedFormGroup;
  submitted: any = false;
  error: any = "";
  successmsg: any = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public store: Store,
    public toastr: ToastrService
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) return;
    // stop here if form is invalid
    let payload = {
      firstName: this.f["firstName"].value,
      lastName: this.f["lastName"].value,
      email: this.f["email"].value,
      userName: this.f["username"].value,
      password: this.f["password"].value,
    };

    //Dispatch Action
    this.authenticationService.register(payload).subscribe(
      (response) => {
        console.log("Registration successful:", response);
        this.toastr.success("Registration successful", "Bootstrap");
      },
      (error) => {
        let firstErrorMessage =
          error.error.errors[Object.keys(error.error.errors)[0]];
        this.error = firstErrorMessage;
      }
    );
  }

}
