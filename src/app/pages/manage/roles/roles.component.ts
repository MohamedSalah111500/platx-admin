import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ManageService } from "../services/manageService.service";
import { Role, RoleForm, UpdateRoleRequest } from "../types";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
})

export class RolesComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  term: any;
  submitted = false;
  endItem: any;
  @ViewChild("newContactModal", { static: false })
  newContactModal?: ModalDirective;
  @ViewChild("removeItemModal", { static: false })
  removeItemModal?: ModalDirective;
  deleteId: any;
  returnedArray: any;
  editMode: boolean = false;
  // -------------------
  loading: boolean = false;
  list: Role[];
  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 8;
  roleForm: FormGroup<RoleForm>;

  constructor(
    private fb: FormBuilder,
    private manageService: ManageService,
    public toastr: ToastrService
  ) {
    this.roleForm = this.fb.group<RoleForm>({
      id: new FormControl(null),
      name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    });
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage" },
      { label: "Roles", active: true },
    ];
    this.getAllData(this.page, this.pageSize);
  }

  getAllData(pageNumber: number, pageSize: number) {
    this.manageService.getAllRoles(pageNumber, pageSize).subscribe(
      (response) => {
        this.list = response.items;
        this.returnedArray = response.items;
        this.totalCount = response.totalCount;

        console.log(response.items);
      },
      (error) => {}
    );
  }

  create(): void {
    this.submitted = true;
    if (this.roleForm.valid) {
      const payload: UpdateRoleRequest = {
        name: this.roleForm.controls.name.value,
      };
      if (this.editMode) {
        payload.id = this.roleForm.controls.id.value;
        this.manageService.updateRole(payload).subscribe((response) => {
          console.log("Role Updated:", response);
          this.newContactModal?.hide();
        });
      } else {
        this.manageService.createRole(payload).subscribe((response) => {
          console.log("Role created:", response);
          this.newContactModal?.hide();
        });
      }
      this.getAllData(this.page, this.pageSize);
    }
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
    this.editMode = true;
    this.submitted = false;
    this.newContactModal?.show();
    this.roleForm.patchValue(item);
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
    this.manageService.deleteRole(id).subscribe(() => {
      this.toastr.success("deleted successfully", "Role");
      this.getAllData(this.page, this.pageSize);
    });
    this.removeItemModal?.hide();
  }
}
