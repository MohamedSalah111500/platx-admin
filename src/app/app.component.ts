import { Component, OnInit } from "@angular/core";
import { SpinnerService } from "./shared/ui/spinner/spinner.service";
import { CrmPageAccessService } from "./core/services/crm-page-access.service";
import { CurrentUserService } from "./core/services/current-user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  isSpinnerVisible = false;

  constructor(
    private spinnerService: SpinnerService,
    private pageAccess: CrmPageAccessService,
    private currentUser: CurrentUserService
  ) {}

  userData = {
    // token:"Basic MTExNzk4ODU6NjAtZGF5ZnJlZXRyaWFs",
    expiryDateTime: "2024-01-31T23:04:08Z",
    userId: "6dd2fd4c-533b-4e80-8d81-08dc22aea7ea",
    userName: "sayed123",
    email: "sayed123@gmail.com",
    firstName: "Mohamed",
    lastName: "Salah",
    isEmailVerified: true,
    roles: [],
  };

  ngOnInit() {
   // localStorage.setItem("currentUser", JSON.stringify(this.userData));
    this.spinnerService.visibility$.subscribe((isVisible) => {
      this.isSpinnerVisible = isVisible;
    });

    // Picks up a grant the owner changed while this session was open.
    if (this.currentUser.isCrmUser) {
      this.pageAccess.load().subscribe();
    }
  }
}
