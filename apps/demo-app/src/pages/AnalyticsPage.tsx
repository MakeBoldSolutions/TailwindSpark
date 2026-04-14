import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';

/**
 * Metric card component properties.
 */
interface MetricCardProps {
  /**
   * Metric title.
   */
  title: string;
  /**
   * Current metric value.
   */
  value: string;
  /**
   * Change indicator (e.g., "+12%").
   */
  change: string;
  /**
   * Trend direction (up or down).
   */
  trend: 'up' | 'down';
  /**
   * Icon emoji.
   */
  icon: string;
  /**
   * Color theme for the card.
   */
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon, color }) => (
  <div className="rounded-panel border border-border bg-[var(--card-bg)] p-6 shadow-card transition-all duration-200 hover:shadow-lg">
    <div className="mb-4 flex items-center justify-between">
      <div
        className={`h-12 w-12 ${color} flex items-center justify-center rounded-lg text-xl text-white`}
      >
        {icon}
      </div>
      <span
        className={`text-sm font-medium ${
          trend === 'up' ? 'text-success' : 'text-error'
        }`}
      >
        {change}
      </span>
    </div>
    <h3 className="mb-1 text-sm font-medium text-text-muted">{title}</h3>
    <p className="text-2xl font-bold text-text">{value}</p>
  </div>
);

const TrafficSourceItem: React.FC<{
  source: string;
  visitors: string;
  percentage: number;
  color: string;
}> = ({ source, visitors, percentage, color }) => (
  <div className="flex items-center justify-between rounded-panel p-4 transition-colors hover:bg-surface-alt">
    <div className="flex items-center gap-3">
      <div className={`h-3 w-3 rounded-full ${color}`}></div>
      <div>
        <p className="text-sm font-medium text-text">{source}</p>
        <p className="text-xs text-text-muted">{visitors} visitors</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium text-text">{percentage}%</p>
      <div className="relative mt-1 h-2 w-16 rounded-full bg-surface-alt">
        <div
          className={`h-full ${color} absolute left-0 top-0 rounded-full`}
          data-width={`${percentage}%`}
        ></div>
      </div>
    </div>
  </div>
);

/**
 * Analytics page with metrics, charts, and traffic data.
 * 
 * Comprehensive analytics dashboard displaying page views, visitors, bounce rate,
 * traffic sources, and conversion metrics with interactive visualizations.
 * 
 * @returns Analytics page component
 * 
 * @example
 * ```tsx
 * <AnalyticsPage />
 * ```
 */
export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    {
      title: 'Page Views',
      value: '127,543',
      change: '+12.5%',
      trend: 'up' as const,
      icon: '👁️',
      color: 'bg-data-viz-1',
    },
    {
      title: 'Unique Visitors',
      value: '23,847',
      change: '+8.2%',
      trend: 'up' as const,
      icon: '👥',
      color: 'bg-data-viz-2',
    },
    {
      title: 'Click Rate',
      value: '3.24%',
      change: '-2.1%',
      trend: 'down' as const,
      icon: '👆',
      color: 'bg-brand',
    },
    {
      title: 'Avg. Session',
      value: '4m 32s',
      change: '+15.3%',
      trend: 'up' as const,
      icon: '⏱️',
      color: 'bg-data-viz-5',
    },
  ];

  const trafficSources = [
    { source: 'Organic Search', visitors: '45,231', percentage: 45, color: 'bg-data-viz-1' },
    { source: 'Direct Traffic', visitors: '28,847', percentage: 28, color: 'bg-data-viz-2' },
    { source: 'Social Media', visitors: '15,429', percentage: 15, color: 'bg-brand' },
    { source: 'Email Campaign', visitors: '8,934', percentage: 9, color: 'bg-data-viz-5' },
    { source: 'Referrals', visitors: '3,102', percentage: 3, color: 'bg-data-viz-4' },
  ];

  const topPages = [
    { page: '/dashboard', views: '23,847', uniqueViews: '18,234', bounceRate: '23.4%' },
    { page: '/analytics', views: '18,234', uniqueViews: '15,923', bounceRate: '18.7%' },
    { page: '/users', views: '12,456', uniqueViews: '9,834', bounceRate: '31.2%' },
    { page: '/settings', views: '8,945', uniqueViews: '7,123', bounceRate: '28.9%' },
    { page: '/profile', views: '6,234', uniqueViews: '5,456', bounceRate: '15.3%' },
  ];

  return (
    <DashboardLayout
      pageTitle="Analytics"
      pageDescription="Monitor your website performance and user engagement."
      headerActions={
        <select
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
          className="rounded-control border border-border bg-surface px-3 py-2 text-sm text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          aria-label="Select time range"
          title="Select time range"
        >
          <option value="1d">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      }
    >
      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            trend={metric.trend}
            icon={metric.icon}
            color={metric.color}
          />
        ))}
      </div>

      {/* Charts and Data */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Traffic Trend Chart */}
        <div className="rounded-panel border border-border bg-[var(--card-bg)] p-6 shadow-card lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text">
              Traffic Trend
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-data-viz-1"></span>
                <span className="text-muted">Page Views</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-data-viz-2"></span>
                <span className="text-muted">Unique Visitors</span>
              </div>
            </div>
          </div>
          <div className="flex h-64 items-end justify-between gap-1">
            {/* Traffic chart representation */}
            {[
              { views: 'h-32', visitors: 'h-24' },
              { views: 'h-40', visitors: 'h-32' },
              { views: 'h-28', visitors: 'h-20' },
              { views: 'h-48', visitors: 'h-36' },
              { views: 'h-56', visitors: 'h-44' },
              { views: 'h-36', visitors: 'h-28' },
              { views: 'h-52', visitors: 'h-40' },
              { views: 'h-60', visitors: 'h-48' },
              { views: 'h-44', visitors: 'h-36' },
              { views: 'h-40', visitors: 'h-32' },
              { views: 'h-56', visitors: 'h-44' },
              { views: 'h-64', visitors: 'h-52' },
            ].map((bar, index) => (
              <div key={index} className="flex flex-1 items-end gap-1">
                <div
                  className={`w-full rounded-t-sm bg-data-viz-1 ${bar.views} transition-all duration-300 hover:bg-brand-hover`}
                ></div>
                <div
                  className={`w-full rounded-t-sm bg-data-viz-2 ${bar.visitors} transition-all duration-300 hover:bg-success-700`}
                ></div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-xs text-muted">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="rounded-panel border border-border bg-[var(--card-bg)] p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-text">Real-time</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-success">847</div>
              <div className="text-sm text-muted">Active Users</div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Top Active Page</span>
                  <span className="font-medium text-text">/dashboard</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Active Sessions</span>
                  <span className="font-medium text-text">1,234</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Page Views/min</span>
                  <span className="font-medium text-text">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Sources and Top Pages */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Traffic Sources */}
        <div className="rounded-panel border border-border bg-[var(--card-bg)] p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-text">
            Traffic Sources
          </h3>
          <div className="space-y-2">
            {trafficSources.map((source, index) => (
              <TrafficSourceItem
                key={index}
                source={source.source}
                visitors={source.visitors}
                percentage={source.percentage}
                color={source.color}
              />
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="overflow-hidden rounded-panel border border-border bg-[var(--card-bg)] shadow-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-lg font-semibold text-text">Top Pages</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                    Bounce Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {topPages.map((page, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-surface-alt"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-text">
                        {page.page}
                      </div>
                      <div className="text-sm text-muted">
                        {page.uniqueViews} unique
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                      {page.views}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                      {page.bounceRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
