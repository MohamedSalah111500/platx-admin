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
    this.statData = [
      { title: 'Total Tenants', value: `${o.totalTenants}`, icon: 'bx-buildings' },
      { title: 'Active Tenants', value: `${o.activeTenants}`, icon: 'bx-check-shield' },
      { title: 'Total Users', value: `${o.totalUsers}`, icon: 'bx-group' },
      { title: 'Active Users (30d)', value: `${o.activeUsers30d}`, icon: 'bx-user-check' },
      { title: 'Students', value: `${o.totalStudents}`, icon: 'bx-user' },
      { title: 'Courses', value: `${o.totalCourses}`, icon: 'bx-book-open' },
      { title: 'Enrollments', value: `${o.totalEnrollments}`, icon: 'bx-collection' },
      { title: 'New Users This Month', value: `${o.newUsersThisMonth}`, icon: 'bx-trending-up' },
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
    this.activityStats = [
      { label: 'Enrollments', value: a.enrollments, icon: 'bx-collection' },
      { label: 'Exams Taken', value: a.examsTaken, icon: 'bx-edit-alt' },
      { label: 'Homework Submissions', value: a.homeworkSubmissions, icon: 'bx-task' },
      { label: 'Lessons Completed', value: a.lessonsCompleted, icon: 'bx-check-circle' },
      { label: 'Live Classes', value: a.liveClasses, icon: 'bx-video' },
      { label: 'QR Redemptions', value: a.qrRedemptions, icon: 'bx-qr-scan' },
      { label: 'Messages', value: a.messagesSent, icon: 'bx-message-dots' },
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
