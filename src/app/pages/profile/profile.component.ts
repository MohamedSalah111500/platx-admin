import { Component, OnInit } from "@angular/core";

import { revenueBarChart, statData } from "./data";

import { ChartType, StaffResponse } from "./types";
import { AuthenticationService } from "src/app/account/auth/services/auth.service";
import { User } from "src/app/store/Authentication/auth.models";
import { ActivatedRoute } from "@angular/router";
import { ManageService } from "../manage/services/manageService.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})

/**
 * Contacts-profile component
 */
export class ProfileComponent implements OnInit {
  user: User;
  breadCrumbItems: Array<{}>;
  revenueBarChart: ChartType;
  statData: any;
  type: string;
  profileId: string;
  data: any;
  loading: boolean = false;
  profileData!: StaffResponse;
  hasQualification: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private manageService: ManageService
  ) {
    this.user = this.authService.currentUser();
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "PlatX" },
      { label: "Profile", active: true },
    ];

    this.getdataFromQueryParam();
    this.getProfileData();
  }

  getdataFromQueryParam() {
    this.route.queryParams.subscribe((params) => {
      this.type = params["type"];
      this.profileId = params["id"];
    });
  }

  private getProfileData() {
    this.loading = true;
    let fetchDataFun = null;
    switch (this.type) {
      case "staff":
        fetchDataFun = this.manageService.getStaff(this.profileId);
        break;
      case "student":
        fetchDataFun = this.manageService.getStudent(this.profileId);
        break;
      default:
        break;
    }
    fetchDataFun.subscribe((response) => {
      this.profileData = response;
      this.hasQualification =
        response.qualification?.lenght == 0 ? false : true;
      this.loading = false;
    });

    // this.manageService.getAllStaff(pageNumber, pageSize).subscribe(
    //   (response) => {
    //     this.list = response.items;
    //     this.returnedArray = [...this.list];
    //     this.totalCount = response.totalCount;
    //     this.loading = false;
    //   },
    //   (error) => {
    //     this.loading = false;
    //   }
    // );

    this.revenueBarChart = revenueBarChart;
    this.statData = statData;
  }
}
