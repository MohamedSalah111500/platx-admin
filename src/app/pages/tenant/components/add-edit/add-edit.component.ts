import { Component } from "@angular/core";
import { TenantFormGroup } from "../../types";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TenantService } from "../../services/tenantService.service";
import { errorMapper } from "src/app/utiltis/functions";

@Component({
  selector: "platx-admin-add-edit",
  templateUrl: "./add-edit.component.html",
  styleUrl: "./add-edit.component.css",
})
export class AddEditComponent {
  errorMapper = errorMapper;

  breadCrumbItems: Array<{}> = [
    { label: "Manage Tenant" },
    { label: "List", active: true },
  ];
  submitted = false;
  endItem: any;
  editMode: boolean = false;

  tenantForm: FormGroup<TenantFormGroup> = this.fb.group<TenantFormGroup>({
    LastName: new FormControl("", [Validators.required]),
    Domain: new FormControl("", [Validators.required]),
    LogoFile: new FormControl("", [Validators.required]),
    IsActive: new FormControl(true, [Validators.required]),
    CoverFile: new FormControl("", [Validators.required]),
    Title: new FormControl("", [Validators.required]),
    FirstName: new FormControl("", [Validators.required]),
    Password: new FormControl("", [Validators.required]),
    Email: new FormControl("", [Validators.required]),
    Description: new FormControl(""),
    CreatedBy: new FormControl(""),
  });
  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    public toastr: ToastrService
  ) {}

  onFileUploadSuccess(controlName: string, file: any): void {
    this.tenantForm.get(controlName)?.setValue(file);
  }

  onSubmit(): void {
    this.submitted = true;
    console.log(this.tenantForm);
    if (!this.tenantForm.valid) return;
    let formVal = this.tenantForm.value;
    const formData = new FormData();

    formData.append("CoverFile", formVal.CoverFile);
    formData.append("CreatedBy", formVal.CreatedBy); //@TODO
    formData.append("Description", formVal.Description);
    formData.append("Domain", formVal.Domain);
    formData.append("Email", formVal.Email);
    formData.append("FirstName", formVal.FirstName);
    formData.append("IsActive", formVal.IsActive.toString());
    formData.append("LastName", formVal.LastName);
    formData.append("LogoFile", formVal.LogoFile);
    formData.append("Password", formVal.Password);
    formData.append("Title", formVal.Title);

    if (this.editMode) {
      // this.tenantService.updateRole(payload).subscribe((response) => {
      //   console.log("Role Updated:", response);
      // });
    } else {
      this.tenantService.postCreateTenant(formData).subscribe(
        (response) => {
          this.toastr.success("Tenant created successfully");
          console.log("Tenant Updated:", response);
        },
        // (error) => {
        //   this.toastr.error(this.errorMapper(error.error.errors));
        // }
      );
    }
  }
}
