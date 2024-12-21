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
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: "app-tenant",
  templateUrl: "./tenant.component.html",
})
export class TenantComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  term: any;

  @ViewChild("newContactModal", { static: false })
  newContactModal?: ModalDirective;
  @ViewChild("removeItemModal") removeItemModal?: ModalDirective;
  @ViewChild("confirmModal") confirmModal?: ModalDirective;

  deleteId: any;
  returnedArray: any;
  // -------------------
  loading: boolean = false;
  list: any[];
  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 10;
  isLoading = true;

  selectedTenant: any;

  constructor(
    private fb: FormBuilder,
    public toastr: ToastrService,
    public tenantService: TenantService,
    private router: Router
  ) {}
  OnBeforeChange: Observable<boolean> = new Observable((observer) => {
    this.confirmModal.show();
  });

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

  edit(item: any) {
    this.router.navigateByUrl("/tenant/add-edit", {
      state: { mode: "edit", id: item.id },
    });
  }

  onToggle(event, tenant: string) {
    this.selectedTenant = tenant;
  }

  confirmActivation() {
    if (this.selectedTenant.isActive) {
      this.tenantService.deActivateTenant(this.selectedTenant.id).subscribe(
        () => {
          this.toastr.success("Tenant DeActivated successfully");
          this.getAllData(this.page, this.pageSize);
          this.confirmModal.hide();
        },
        (error) => this.toastr.success("Tenant DeActivated Failed")
      );
    } else {
      this.tenantService.activateTenant(this.selectedTenant.id).subscribe(
        () => {
          this.toastr.success("Tenant DeActivated successfully");
          this.getAllData(this.page, this.pageSize);
          this.confirmModal.hide();
        },
        (error) => this.toastr.success("Tenant DeActivated Failed")
      );
    }
  }
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
    this.tenantService.deleteTenant(id).subscribe(() => {
      this.toastr.success("deleted successfully", "Role");
      this.getAllData(this.page, this.pageSize);
    });
    this.removeItemModal?.hide();
  }
}
