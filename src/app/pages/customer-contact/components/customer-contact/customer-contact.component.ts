import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { FormBuilder } from "@angular/forms";

import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { CustomerContact, Tenant } from "../../types";
import { CustomerContactService } from "../../services/customer-contact.service";

@Component({
  selector: "app-customer-contact",
  templateUrl: "./customer-contact.component.html",
})
export class CustomerContactComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  term: any;

  @ViewChild("newContactModal", { static: false })
  newContactModal?: ModalDirective;
  @ViewChild("removeItemModal") removeItemModal?: ModalDirective;
  @ViewChild("confirmModal") confirmModal?: ModalDirective;
  @ViewChild("updateQuota") updateQuota?: ModalDirective;

  deleteId: any;
  returnedArray: any;
  tenantIdOfQuota: string;
  // -------------------
  loading: boolean = false;
  list: CustomerContact[] = [];
  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 10;
  isLoading = true;
  newQuota: number = 0;
  isSubmitedNewQuota = false;
  selectedTenant: any;

  constructor(
    private fb: FormBuilder,
    public toastr: ToastrService,
    public customerContactService: CustomerContactService,
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
    this.customerContactService
      .getAllPlatXContacts(pageNumber, pageSize)
      .subscribe(
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

  onToggle(event, tenant: Tenant) {
    this.selectedTenant = tenant;
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

  onCancelChangeQuota() {
    this.newQuota = 0;
    this.updateQuota?.hide();
  }
  confirmDelete(id: any) {
    this.customerContactService.deleteContact(id).subscribe(() => {
      this.toastr.success("deleted successfully", "Contact");
      this.getAllData(this.page, this.pageSize);
    });
    this.removeItemModal?.hide();
  }
}
