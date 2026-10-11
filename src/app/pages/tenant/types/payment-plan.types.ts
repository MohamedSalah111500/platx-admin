import { TenantInstallment } from "./installment.types";

export enum PaymentPlanKind {
  PaidInFull = 0,
  EqualInstallments = 1,
  DepositThenInstallments = 2,
}

export enum InstallmentFrequency {
  Monthly = 0,
  Quarterly = 1,
  Weekly = 2,
  Yearly = 3,
}

export interface GeneratePaymentPlanPayload {
  totalAmount: number;
  kind: PaymentPlanKind;
  depositAmount?: number | null;
  depositDueDate?: string | null;
  installmentsCount: number;
  frequency: InstallmentFrequency;
  firstDueDate: string;
  replaceExisting: boolean;
  depositAlreadyPaid: boolean;
}

export interface TenantFinancialSummary {
  contractAmount: number | null;
  scheduledAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  overdueCount: number;
  unallocatedAmount: number;
  installmentsCount: number;
  paidCount: number;
  collectedPercentage: number;
  nextDueDate: string | null;
  nextDueAmount: number | null;
}

export interface PaymentPlanResult {
  summary: TenantFinancialSummary;
  installments: TenantInstallment[];
}

export interface PlanPreviewLine {
  amount: number;
  dueDate: Date;
  isDeposit: boolean;
}

export interface DueInstallmentsFilter {
  unpaidOnly: boolean;
  status?: number | null;
  search?: string | null;
  page: number;
  size: number;
}

export interface DueInstallmentsResult {
  items: TenantInstallment[];
  totalCount: number;
  totalAmount: number;
  overdueAmount: number;
  overdueCount: number;
  dueThisMonthAmount: number;
  dueThisMonthCount: number;
}

