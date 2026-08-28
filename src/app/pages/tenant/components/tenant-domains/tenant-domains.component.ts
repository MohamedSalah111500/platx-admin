import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TenantService } from "../../services/tenantService.service";
import { Tenant, TenantDomain } from "../../types";

const HOST_PATTERN = /^(?=.{4,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

@Component({
  selector: "platx-tenant-domains-modal",
  templateUrl: "./tenant-domains.component.html",
  styleUrls: ["./tenant-domains.component.scss"],
})
export class TenantDomainsComponent {
  readonly dnsARecordIp = "144.76.151.1";
  readonly dnsCnameTarget = "site24760.siteasp.net";

  @ViewChild("domainsModal") domainsModal?: ModalDirective;

  tenant?: Tenant;
  domains: TenantDomain[] = [];
  loading = false;
  saving = false;
  showChecklist = false;
  domainToRemove?: TenantDomain;

  addForm: FormGroup;

  constructor(
    private tenantService: TenantService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.addForm = this.fb.group({
      host: ["", [Validators.required, Validators.pattern(HOST_PATTERN)]],
    });
  }

  open(tenant: Tenant): void {
    this.tenant = tenant;
    this.domains = [];
    this.domainToRemove = undefined;
    this.showChecklist = false;
    this.addForm.reset({ host: "" });
    this.domainsModal?.show();
    this.loadDomains();
  }

  close(): void {
    this.domainsModal?.hide();
  }

  loadDomains(): void {
    if (!this.tenant?.id) return;
    this.loading = true;
    this.tenantService.getTenantDomains(this.tenant.id).subscribe({
      next: (d) => {
        this.domains = d ?? [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  normalizeHostInput(): void {
    const raw: string = this.addForm.value.host ?? "";
    const normalized = raw
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "");
    if (normalized !== raw) {
      this.addForm.patchValue({ host: normalized });
    }
  }

  addDomain(): void {
    this.normalizeHostInput();
    if (this.addForm.invalid || this.saving || !this.tenant?.id) {
      this.addForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.tenantService
      .addTenantDomain({
        tenantId: this.tenant.id,
        host: this.addForm.value.host,
        isPrimary: this.domains.length === 0,
      })
      .subscribe({
        next: (created) => {
          this.saving = false;
          this.domains = [...this.domains, created];
          this.addForm.reset({ host: "" });
          this.toastr.success(`${created.host} linked to ${this.tenant?.title}`);
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(this.errorMessage(err, "Failed to link domain"));
        },
      });
  }

  setPrimary(domain: TenantDomain): void {
    if (domain.isPrimary) return;
    this.tenantService.setPrimaryTenantDomain(domain.id).subscribe({
      next: () => {
        this.domains = this.domains.map((d) => ({ ...d, isPrimary: d.id === domain.id }));
        this.toastr.success(`${domain.host} is now the primary domain`);
      },
      error: (err) => this.toastr.error(this.errorMessage(err, "Failed to set primary domain")),
    });
  }

  askRemove(domain: TenantDomain): void {
    this.domainToRemove = domain;
  }

  cancelRemove(): void {
    this.domainToRemove = undefined;
  }

  confirmRemove(): void {
    const target = this.domainToRemove;
    if (!target || this.saving) return;
    this.saving = true;
    this.tenantService.removeTenantDomain(target.id).subscribe({
      next: () => {
        this.saving = false;
        this.domainToRemove = undefined;
        this.domains = this.domains.filter((d) => d.id !== target.id);
        this.toastr.success(`${target.host} unlinked`);
        if (target.isPrimary && this.domains.length > 0) {
          this.loadDomains();
        }
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(this.errorMessage(err, "Failed to unlink domain"));
      },
    });
  }

  copy(value: string): void {
    navigator.clipboard?.writeText(value).then(() => this.toastr.info(`Copied ${value}`));
  }

  private errorMessage(err: any, fallback: string): string {
    const errors = err?.error?.errors;
    if (errors && typeof errors === "object") {
      const first = Object.values(errors)[0];
      if (typeof first === "string" && first) return first;
    }
    return err?.error?.message ?? fallback;
  }
}
