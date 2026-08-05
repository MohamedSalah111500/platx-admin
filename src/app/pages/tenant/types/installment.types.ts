export enum InstallmentStatus {
  Paid = 0,
  Overdue = 1,
  Upcoming = 2,
}

export interface TenantInstallment {
  id: number;
  tenantId: string;
  tenantTitle?: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
  note?: string;
  sortOrder: number;
  status: InstallmentStatus;
  daysOverdue: number;
}

export interface CreateInstallmentPayload {
  amount: number;
  dueDate: string;
  note?: string;
}

export interface UpdateInstallmentPayload {
  amount: number;
  dueDate: string;
  note?: string;
  sortOrder: number;
}

export interface MarkPaidPayload {
  paidDate?: string;
}

export interface PagedInstallmentsResponse {
  items: TenantInstallment[];
  totalCount: number;
}
