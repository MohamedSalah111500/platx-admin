import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ChartType } from './dashboard.model';
import { AnalyticsService } from '../analytics.service';
import {
  CompanyActivity,
  CompanyEngagement,
  CompanyGrowth,
  CompanyOverview,
  CompanyCollections,
  CompanyRevenue,
  CurrencyAmount,
} from '../analytics.models';

const PRIMARY_CURRENCY = 'EGP';

// The API labels every month as "MMM yyyy" in the invariant culture, so the
// month name has to be re-formatted for the reader's language.
const INVARIANT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit, OnDestroy {
  loading = true;

  overview?: CompanyOverview;
  activity?: CompanyActivity;
  engagement?: CompanyEngagement;
  growth?: CompanyGrowth;
  revenue?: CompanyRevenue;
  collections?: CompanyCollections;
  collectionsChart?: ChartType;

  statData: { title: string; value: string; icon: string }[] = [];
  activityStats: { label: string; value: number; icon: string }[] = [];
  growthChart?: ChartType;
  maxPlanCount = 0;

  private destroy$ = new Subject<void>();

  constructor(private analytics: AnalyticsService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.loadAll();
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.collections) this.buildCollectionsChart(this.collections);
      if (this.growth) this.buildGrowthChart(this.growth);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh(): void {
    this.loading = true;
    this.loadAll();
  }

  get collectionRate(): number {
    return Math.min(100, Math.max(0, this.collections?.collectionRate ?? 0));
  }

  private monthLabel(label: string): string {
    const [month, year] = (label || '').split(' ');
    const index = INVARIANT_MONTHS.indexOf(month);
    if (index < 0 || !year) return label;
    const locale = this.translate.currentLang === 'ar' ? 'ar-EG' : 'en';
    return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' })
      .format(new Date(Number(year), index, 1));
  }

  private buildCollectionsChart(c: CompanyCollections): void {
    this.collectionsChart = {
      chart: { height: 300, type: 'bar', toolbar: { show: false }, stacked: false },
      plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 4 } },
      dataLabels: { enabled: false },
      series: [
        {
          name: this.translate.instant('DASHBOARD.COLLECTIONS.DUE'),
          data: c.monthlyCollections.map((p) => p.due),
        },
        {
          name: this.translate.instant('DASHBOARD.COLLECTIONS.COLLECTED'),
          data: c.monthlyCollections.map((p) => p.collected),
        },
      ],
      xaxis: { categories: c.monthlyCollections.map((p) => this.monthLabel(p.label)) },
      colors: ['#e9ecef', '#34c38f'],
      legend: { position: 'bottom' },
      fill: { opacity: 1 },
    };
  }








  private loadAll(): void {
    this.analytics.getCollections(6, 5).subscribe({
      next: (c) => {
        this.collections = c;
        this.buildCollectionsChart(c);
      },
      error: () => (this.collections = undefined),
    });

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
        {
          name: this.translate.instant('DASHBOARD.GROWTH_SERIES.USERS'),
          data: g.points.map((p) => p.newUsers),
        },
        {
          name: this.translate.instant('DASHBOARD.GROWTH_SERIES.ENROLLMENTS'),
          data: g.points.map((p) => p.newEnrollments),
        },
        {
          name: this.translate.instant('DASHBOARD.GROWTH_SERIES.TENANTS'),
          data: g.points.map((p) => p.newTenants),
        },
      ],
      xaxis: { categories: g.points.map((p) => this.monthLabel(p.label)) },
      colors: ['#556ee6', '#34c38f', '#f1b44c'],
      legend: { position: 'bottom' },
      fill: { opacity: 1 },
    };
  }
}
