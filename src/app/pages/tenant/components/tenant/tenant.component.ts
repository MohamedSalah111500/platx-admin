import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ToastrService } from "ngx-toastr";
import { TenantService } from "./../../services/tenantService.service";

@Component({
  selector: "app-tenant",
  templateUrl: "./tenant.component.html",
})
export class TenantComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  term: any;

  @ViewChild("newContactModal", { static: false })
  newContactModal?: ModalDirective;
  @ViewChild("removeItemModal", { static: false })
  removeItemModal?: ModalDirective;
  deleteId: any;
  returnedArray: any;
  // -------------------
  loading: boolean = false;
  list: any[];
  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 8;

  constructor(
    private fb: FormBuilder,
    public toastr: ToastrService,
    public tenantService: TenantService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage Tenant" },
      { label: "List", active: true },
    ];
    this.getAllData(this.page, this.pageSize);
  }

  getAllData(pageNumber: number, pageSize: number) {
    this.tenantService.getAllTenants(pageNumber, pageSize).subscribe(
      (response) => {
        this.list = response.items;
        this.returnedArray = response.items;
        this.totalCount = response.totalCount;
        console.log(response.items);
      },
      (error) => {}
    );
  }

  search() {
    if (this.term) {
      this.list = this.returnedArray.filter((data: any) => {
        return data.name.toLowerCase().includes(this.term.toLowerCase());
      });
    } else {
      this.list = this.returnedArray;
    }
  }

  edit(item: any) {}

  // pagechanged
  pageChanged(event: PageChangedEvent): void {
    this.getAllData(event.page, event.itemsPerPage);
    this.page = event.page;
  }

  openDeleteModel(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show();
  }

  confirmDelete(id: any) {
    // this.manageService.deleteRole(id).subscribe(() => {
    //   this.toastr.success("deleted successfully", "Role");
    //   this.getAllData(this.page, this.pageSize);
    // });
    // this.removeItemModal?.hide();
  }
}
