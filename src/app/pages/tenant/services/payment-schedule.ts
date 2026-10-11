import {
  InstallmentFrequency,
  PaymentPlanKind,
  PlanPreviewLine,
} from "../types/payment-plan.types";

export interface SchedulePlanInput {
  totalAmount: number;
  kind: PaymentPlanKind;
  depositAmount: number | null;
  depositDueDate: string | null;
  installmentsCount: number;
  frequency: InstallmentFrequency;
  firstDueDate: string | null;
}

const MAX_INSTALLMENTS = 120;

function truncateToPiastres(value: number): number {
  return Math.floor(value * 100) / 100;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function addPeriod(start: Date, frequency: InstallmentFrequency, periods: number): Date {
  const date = new Date(start.getTime());
  switch (frequency) {
    case InstallmentFrequency.Weekly:
      date.setDate(date.getDate() + 7 * periods);
      return date;
    case InstallmentFrequency.Quarterly:
      return addMonthsClamped(start, 3 * periods);
    case InstallmentFrequency.Yearly:
      date.setFullYear(date.getFullYear() + periods);
      return date;
    default:
      return addMonthsClamped(start, periods);
  }
}

/** Mirrors .NET's AddMonths: the day is clamped to the last day of the target month. */
function addMonthsClamped(start: Date, months: number): Date {
  const year = start.getFullYear();
  const month = start.getMonth() + months;
  const target = new Date(year, month, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(start.getDate(), lastDay));
  return target;
}

/**
 * Client-side twin of the server's PaymentScheduleBuilder so the preview a user approves is
 * exactly the schedule that gets saved; any drift here shows up as a wrong preview.
 */
export function buildPlanPreview(input: SchedulePlanInput): PlanPreviewLine[] {
  const total = Number(input.totalAmount);
  if (!total || total <= 0 || !input.firstDueDate) return [];

  const firstDue = new Date(`${input.firstDueDate}T00:00:00`);
  if (isNaN(firstDue.getTime())) return [];

  if (input.kind === PaymentPlanKind.PaidInFull) {
    return [{ amount: round2(total), dueDate: firstDue, isDeposit: false }];
  }

  const lines: PlanPreviewLine[] = [];
  let remaining = total;

  if (input.kind === PaymentPlanKind.DepositThenInstallments) {
    const deposit = Number(input.depositAmount ?? 0);
    if (!deposit || deposit <= 0 || deposit >= total) return [];
    const depositDate = input.depositDueDate
      ? new Date(`${input.depositDueDate}T00:00:00`)
      : firstDue;
    lines.push({ amount: round2(deposit), dueDate: depositDate, isDeposit: true });
    remaining = round2(total - deposit);
  }

  const count = Number(input.installmentsCount);
  if (!count || count < 1 || count > MAX_INSTALLMENTS) return lines;

  const each = truncateToPiastres(remaining / count);
  const last = round2(remaining - each * (count - 1));

  for (let i = 0; i < count; i++) {
    lines.push({
      amount: i === count - 1 ? last : each,
      dueDate: addPeriod(firstDue, input.frequency, i),
      isDeposit: false,
    });
  }

  return lines;
}
