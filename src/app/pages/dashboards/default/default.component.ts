import { Component, OnInit } from '@angular/core';
import { ChartType } from './dashboard.model';
import { AnalyticsService } from '../analytics.service';
import {
  CompanyActivity,
  CompanyEngagement,
  CompanyGrowth,
  CompanyOverview,
  CompanyRevenue,
  CurrencyAmount,
} from '../analytics.models';

const PRIMARY_CURRENCY = 'EGP';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  loading = true;

  overview?: CompanyOverview;
  activity?: CompanyActivity;
  engagement?: CompanyEngagement;
  growth?: CompanyGrowth;
  revenue?: CompanyRevenue;

  statData: { title: string; value: string; icon: string }[] = [];
  activityStats: { label: string; value: number; icon: string }[] = [];
  growthChart?: ChartType;
  maxPlanCount = 0;

  constructor(private analytics: AnalyticsService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  refresh(): void {
    this.loading = true;
    this.loadAll();
  }

  private loadAll(): void {
    this.analytics.getOverview().subscribe({
      next: (o) => {
        this.overview = o;
        this.buildStats(o);
      },
    });

    this.analytics.getActivity().subscribe({
      next: (a) => {
        this.activity = a;
        this.buildActivity(a);
      },
    });

    this.analytics.getEngagement().subscribe({
      next: (e) => (this.engagement = e),
    });

    this.analytics.getRevenue().subscribe({
      next: (r) => {
        this.revenue = r;
        this.maxPlanCount = Math.max(1, ...r.planDistribution.map((p) => p.count));
      },
    });

    this.analytics.getGrowth(12).subscribe({
      next: (g) => {
        this.growth = g;
        this.buildGrowthChart(g);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  private buildStats(o: CompanyOverview): void {
    // titles are translation keys — rendered via `| translate` in the template
    this.statData = [
      { title: 'DASHBOARD.STAT.TOTAL_TENANTS', value: `${o.totalTenants}`, icon: 'bx-buildings' },
      { title: 'DASHBOARD.STAT.ACTIVE_TENANTS', value: `${o.activeTenants}`, icon: 'bx-check-shield' },
      { title: 'DASHBOARD.STAT.TOTAL_USERS', value: `${o.totalUsers}`, icon: 'bx-group' },
      { title: 'DASHBOARD.STAT.ACTIVE_USERS_30D', value: `${o.activeUsers30d}`, icon: 'bx-user-check' },
      { title: 'DASHBOARD.STAT.STUDENTS', value: `${o.totalStudents}`, icon: 'bx-user' },
      { title: 'DASHBOARD.STAT.COURSES', value: `${o.totalCourses}`, icon: 'bx-book-open' },
      { title: 'DASHBOARD.STAT.ENROLLMENTS', value: `${o.totalEnrollments}`, icon: 'bx-collection' },
      { title: 'DASHBOARD.STAT.NEW_USERS_MONTH', value: `${o.newUsersThisMonth}`, icon: 'bx-trending-up' },
    ];
  }

  primaryRevenue(): CurrencyAmount {
    const totals = this.revenue?.totalRevenue || [];
    return (
      totals.find((r) => r.currency === PRIMARY_CURRENCY) ||
      totals[0] || { currency: PRIMARY_CURRENCY, amount: 0 }
    );
  }

  otherRevenues(): CurrencyAmount[] {
    const primary = this.primaryRevenue();
    return (this.revenue?.totalRevenue || []).filter((r) => r.currency !== primary.currency);
  }

  initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }

  private buildActivity(a: CompanyActivity): void {
    // labels are translation keys — rendered via `| translate` in the template
    this.activityStats = [
      { label: 'DASHBOARD.ACTIVITY.ENROLLMENTS', value: a.enrollments, icon: 'bx-collection' },
      { label: 'DASHBOARD.ACTIVITY.EXAMS', value: a.examsTaken, icon: 'bx-edit-alt' },
      { label: 'DASHBOARD.ACTIVITY.HOMEWORK', value: a.homeworkSubmissions, icon: 'bx-task' },
      { label: 'DASHBOARD.ACTIVITY.LESSONS', value: a.lessonsCompleted, icon: 'bx-check-circle' },
      { label: 'DASHBOARD.ACTIVITY.LIVE', value: a.liveClasses, icon: 'bx-video' },
      { label: 'DASHBOARD.ACTIVITY.QR', value: a.qrRedemptions, icon: 'bx-qr-scan' },
      { label: 'DASHBOARD.ACTIVITY.MESSAGES', value: a.messagesSent, icon: 'bx-message-dots' },
    ];
  }

  private buildGrowthChart(g: CompanyGrowth): void {
    this.growthChart = {
      chart: { height: 350, type: 'bar', toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false, columnWidth: '35%', borderRadius: 4 } },
      dataLabels: { enabled: false },
      series: [
        { name: 'New Users', data: g.points.map((p) => p.newUsers) },
        { name: 'New Enrollments', data: g.points.map((p) => p.newEnrollments) },
        { name: 'New Tenants', data: g.points.map((p) => p.newTenants) },
      ],
      xaxis: { categories: g.points.map((p) => p.label) },
      colors: ['#556ee6', '#34c38f', '#f1b44c'],
      legend: { position: 'bottom' },
      fill: { opacity: 1 },
    };
  }
}
