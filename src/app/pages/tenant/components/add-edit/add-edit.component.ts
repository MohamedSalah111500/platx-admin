import {Component} from "@angular/core";
import {TenantFormGroup} from "../../types";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {TenantService} from "../../services/tenantService.service";
import {errorMapper} from "src/app/utiltis/functions";
import {Tenant} from "./../../types";

@Component({
  selector: "platx-admin-add-edit",
  templateUrl: "./add-edit.component.html",
  styleUrl: "./add-edit.component.css",
})
export class AddEditComponent {
  errorMapper = errorMapper;
  breadCrumbItems: Array<{}> = [
    {label: "Manage Tenant"},
    {label: "Create",active: true},
  ];
  submitted = false;
  mode: string = "create";

  tenantForm: FormGroup<TenantFormGroup> = this.fb.group<TenantFormGroup>({
    id: new FormControl(null),
    LastName: new FormControl("",[Validators.required]),
    FirstName: new FormControl("",[Validators.required]),
    Domain: new FormControl("",[Validators.required]),
    PhoneNumber: new FormControl("",[Validators.required]),
    LogoFile: new FormControl("",[Validators.required]),
    IsActive: new FormControl(true,[Validators.required]),
    CoverFile: new FormControl("",[Validators.required]),
    Title: new FormControl("",[Validators.required]),
    Email: new FormControl("",[Validators.required]),
    Description: new FormControl(""),
    CreatedBy: new FormControl(""),
    quota: new FormControl(30,[Validators.required]),
  });

  constructor (
    private fb: FormBuilder,
    private tenantService: TenantService,
    public toastr: ToastrService
  ) { }

  ngOnInit () {
    this.mode = history.state?.mode;

    if (this.mode == "edit") {
      this.getTenant(history.state?.id);
    }
  }

  getTenant (id: string) {
    this.tenantService.getTenant(id).subscribe(
      (response) => {
        this.updateForm(response);
      },
      (error) => { }
    );
  }

  updateForm (tenant: Tenant): void {
    const mappedResponse = {
      id: tenant.id,
      LastName: tenant.lastName || "",
      Domain: tenant.domain || "",
      LogoFile: tenant?.logoFile || "",
      CoverFile: tenant?.coverFile || "",
      IsActive: tenant.isActive ?? true,
      Title: tenant.title || "",
      FirstName: tenant.firstName || "",
      Email: tenant.email || "",
      Description: tenant.description || "",
      PhoneNumber: tenant.phoneNumber || "",
      CreatedBy: tenant.createdBy || "",
      quota: tenant.quota || 30,
    };
    this.tenantForm.patchValue(mappedResponse);
  }

  onFileUploadSuccess (controlName: string,file: any): void {
    this.tenantForm.get(controlName)?.setValue(file);
  }

  onSubmit (): void {
    this.submitted = true;
    if (!this.tenantForm.valid) return;

    let formVal = this.tenantForm.value;
    const formData = new FormData();
    formData.append("CoverFile",formVal.CoverFile);
    formData.append("CreatedBy",formVal.CreatedBy); //@TODO
    formData.append("Description",formVal.Description);
    formData.append("PhoneNumber",formVal.PhoneNumber);
    formData.append("Domain",formVal.Domain);
    formData.append("Email",formVal.Email);
    formData.append("FirstName",formVal.FirstName);
    formData.append("IsActive",formVal.IsActive.toString());
    formData.append("LastName",formVal.LastName);
    formData.append("LogoFile",formVal.LogoFile);
    formData.append("Title",formVal.Title);

    if (this.mode == "edit") {
      formData.append("Id",formVal.id);
      this.tenantService.putUpdateTenant(formData).subscribe(
        (res) => this.toastr.success("Tenant Updated successfully"),
        (err) => this.toastr.error(this.errorMapper(err.error.errors))
      );
    } else {
      this.tenantService.postCreateTenant(formData).subscribe(
        (response) => {
          this.toastr.success("Tenant created successfully");
        },
        (err) => {
          this.toastr.error(this.errorMapper(err.error?.errors) ?? "Error Please Try Again");
        }
      );
    }
  }
}
