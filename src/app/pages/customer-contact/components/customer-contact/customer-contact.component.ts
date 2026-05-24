import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";

import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ToastrService } from "ngx-toastr";
import { CustomerContact } from "../../types";
import { CustomerContactService } from "../../services/customer-contact.service";

@Component({
  selector: "app-customer-contact",
  templateUrl: "./customer-contact.component.html",
  styleUrls: ["./customer-contact.component.scss"],
})
export class CustomerContactComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  term: any;

  @ViewChild("removeItemModal") removeItemModal?: ModalDirective;
  @ViewChild("messageModal") messageModal?: ModalDirective;

  deleteId: any;
  returnedArray: CustomerContact[] = [];
  // -------------------
  loading: boolean = false;
  list: CustomerContact[] = [];
  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 10;

  typeFilter: "all" | "demo" | "general" = "all";
  selectedMessage: CustomerContact | null = null;

  stats = {
    total: 0,
    demo: 0,
    general: 0,
    uniqueDomains: 0,
    thisWeek: 0,
  };

  constructor(
    public toastr: ToastrService,
    public customerContactService: CustomerContactService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Customer" },
      { label: "Contacts", active: true },
    ];
    this.getAllData(this.page, this.pageSize);
  }

  getAllData(pageNumber: number, pageSize: number) {
    this.loading = true;
    this.customerContactService
      .getAllPlatXContacts(pageNumber, pageSize)
      .subscribe(
        (response) => {
          this.returnedArray = response.items || [];
          this.list = this.returnedArray;
          this.totalCount = response.totalCount;
          this.loading = false;
          this.computeStats();
        },
        () => {
          this.loading = false;
        }
      );
  }

  private computeStats() {
    const demo = this.returnedArray.filter((c) => c.isDemo).length;
    const general = this.returnedArray.length - demo;
    const domains = new Set(
      this.returnedArray
        .map((c) => (c.email || "").split("@")[1])
        .filter((d) => !!d)
    );
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = this.returnedArray.filter((c) => {
      if (!c.createdAt) return false;
      return new Date(c.createdAt).getTime() >= weekAgo;
    }).length;
    this.stats = {
      total: this.totalCount || this.returnedArray.length,
      demo,
      general,
      uniqueDomains: domains.size,
      thisWeek,
    };
  }

  daysSinceCreated(createdAt?: string): number {
    if (!createdAt) return 0;
    const ms = Date.now() - new Date(createdAt).getTime();
    return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  }

  relativeCreated(createdAt?: string): string {
    if (!createdAt) return "—";
    const ms = Date.now() - new Date(createdAt).getTime();
    if (ms < 0) return "Just now";
    const mins = Math.floor(ms / (1000 * 60));
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }

  isNew(createdAt?: string): boolean {
    return this.daysSinceCreated(createdAt) <= 2;
  }

  setFilter(filter: CustomerContactComponent["typeFilter"]) {
    this.typeFilter = filter;
    this.applyFilter();
  }

  private applyFilter() {
    let result = [...this.returnedArray];
    if (this.typeFilter !== "all") {
      result = result.filter((c) =>
        this.typeFilter === "demo" ? c.isDemo : !c.isDemo
      );
    }
    if (this.term) {
      const q = this.term.toLowerCase();
      result = result.filter(
        (data: any) =>
          (data.name || "").toLowerCase().includes(q) ||
          (data.email || "").toLowerCase().includes(q) ||
          (data.phone || "").toLowerCase().includes(q) ||
          (data.massage || "").toLowerCase().includes(q)
      );
    }
    this.list = result;
  }

  search() {
    this.applyFilter();
  }

  initials(name?: string): string {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  avatarColor(seed?: string): string {
    const palette = [
      "#6366f1",
      "#0ea5e9",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#14b8a6",
      "#ec4899",
    ];
    if (!seed) return palette[0];
    let hash = 0;
    for (let i = 0; i < seed.length; i++)
      hash = (hash + seed.charCodeAt(i)) % 999;
    return palette[hash % palette.length];
  }

  truncate(text: string, max = 80): string {
    if (!text) return "";
    return text.length > max ? text.substring(0, max) + "…" : text;
  }

  copy(value: string) {
    if (!value || !navigator?.clipboard) return;
    navigator.clipboard.writeText(value).then(
      () => this.toastr.success("Copied to clipboard"),
      () => this.toastr.error("Failed to copy")
    );
  }

  openMessage(item: CustomerContact) {
    this.selectedMessage = item;
    this.messageModal?.show();
  }

  closeMessage() {
    this.messageModal?.hide();
    this.selectedMessage = null;
  }

  // pagechanged
  pageChanged(event: PageChangedEvent): void {
    if (event.page === this.page) return;
    this.page = event.page;
    this.typeFilter = "all";
    this.term = "";
    this.getAllData(event.page, event.itemsPerPage);
  }

  onPageSizeChange(): void {
    this.page = 1;
    this.typeFilter = "all";
    this.term = "";
    this.getAllData(this.page, this.pageSize);
  }

  openDeleteModel(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show();
  }

  confirmDelete(id: any) {
    this.customerContactService.deleteContact(id).subscribe(() => {
      this.toastr.success("deleted successfully", "Contact");
      this.getAllData(this.page, this.pageSize);
    });
    this.removeItemModal?.hide();
  }
}
