import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';

// Icons (using Unicode symbols for simplicity - in a real app you'd use a proper icon library)
const IconArrowUp = () => <span className="text-green-500">↗</span>;
const IconArrowDown = () => <span className="text-red-500">↘</span>;

/**
 * Stat card component properties.
 */
interface StatCardProps {
  /**
   * Card title.
   */
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-700 dark:bg-secondary-800">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-1/2 rounded bg-secondary-300 dark:bg-secondary-600"></div>
          <div className="mb-2 h-8 w-3/4 rounded bg-secondary-300 dark:bg-secondary-600"></div>
          <div className="h-3 w-1/3 rounded bg-secondary-300 dark:bg-secondary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-secondary-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800">
      <h3 className="mb-2 text-sm font-medium text-text-muted">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-text">{value}</p>
        <div className="flex items-center gap-1">
          {trend === 'up' ? <IconArrowUp /> : <IconArrowDown />}
          <span
            className={`text-sm font-medium ${
              trend === 'up'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {change}
          </span>
        </div>
      </div>
    </div>
  );
};

interface Transaction {
  id: string;
  customer: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <tr className="transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-700">
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center">
          {/* eslint-disable-next-line no-raw-primary-class/no-raw-primary-class */}
          <div className="from-primary-500 to-accent-700 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-medium text-white">
            {transaction.customer.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-text">
              {transaction.customer}
            </p>
            <p className="text-sm text-text-muted">ID: {transaction.id}</p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text">
        {transaction.amount}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[transaction.status]}`}
        >
          {transaction.status}
        </span>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-text-muted">
        {transaction.date}
      </td>
    </tr>
  );
};

const ActivityItem: React.FC<{ activity: { user: string; action: string; time: string } }> = ({
  activity,
}) => (
  <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-700">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600 text-sm font-medium text-white">
      {activity.user.charAt(0).toUpperCase()}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-text">
        <span className="font-medium">{activity.user}</span> {activity.action}
      </p>
      <p className="text-xs text-text-muted">{activity.time}</p>
    </div>
  </div>
);

/**
 * Dashboard page with metrics, transactions, and activity tracking.
 * 
 * Full-featured SaaS dashboard displaying key statistics, recent transactions,
 * activity feed, and quick actions. Demonstrates responsive layout and data visualization.
 * 
 * @returns Dashboard page component
 * 
 * @example
 * ```tsx
 * <DashboardPage />
 * ```
 */
export const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const stats = [
    { title: 'Total Revenue', value: '$847,291', change: '+12.5%', trend: 'up' as const },
    { title: 'Active Users', value: '23,847', change: '+8.2%', trend: 'up' as const },
    { title: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down' as const },
    { title: 'Monthly Growth', value: '18.9%', change: '+5.4%', trend: 'up' as const },
  ];

  const transactions: Transaction[] = [
    {
      id: 'TXN-001',
      customer: 'Alice Johnson',
      amount: '$2,450.00',
      status: 'completed',
      date: '2024-01-15',
    },
    {
      id: 'TXN-002',
      customer: 'Bob Smith',
      amount: '$1,250.00',
      status: 'pending',
      date: '2024-01-15',
    },
    {
      id: 'TXN-003',
      customer: 'Carol Davis',
      amount: '$3,750.00',
      status: 'completed',
      date: '2024-01-14',
    },
    {
      id: 'TXN-004',
      customer: 'David Wilson',
      amount: '$890.00',
      status: 'failed',
      date: '2024-01-14',
    },
    {
      id: 'TXN-005',
      customer: 'Emma Brown',
      amount: '$5,200.00',
      status: 'completed',
      date: '2024-01-13',
    },
  ];

  const activities = [
    { user: 'John Doe', action: 'created a new campaign', time: '2 minutes ago' },
    { user: 'Jane Smith', action: 'updated user profile', time: '5 minutes ago' },
    { user: 'Mike Johnson', action: 'completed onboarding', time: '10 minutes ago' },
    { user: 'Sarah Wilson', action: 'upgraded to Pro plan', time: '15 minutes ago' },
    { user: 'Tom Davis', action: 'exported analytics report', time: '20 minutes ago' },
  ];

  const users = [
    { name: 'Alex Chen', role: 'Admin', status: 'online' },
    { name: 'Maria Garcia', role: 'Editor', status: 'away' },
    { name: 'James Liu', role: 'Viewer', status: 'offline' },
    { name: 'Emily Taylor', role: 'Admin', status: 'online' },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const headerActions = (
    <button
      onClick={handleRefresh}
      className="bg-brand hover:bg-brand-hover rounded-lg px-4 py-2 font-medium text-white transition-colors duration-200"
      disabled={isLoading}
    >
      {isLoading ? 'Refreshing...' : 'Refresh Data'}
    </button>
  );

  return (
    <DashboardLayout
      pageTitle="TailwindSpark Dashboard"
      pageDescription="Welcome to the TailwindSpark SaaS dashboard demo. Explore modern UI patterns and responsive design components."
      headerActions={headerActions}
    >
      {/* Back to Demos Link */}
      <div className="p-6 pb-0">
        <Link
          to="/demos"
          className="text-brand hover:text-brand-hover mb-6 inline-flex items-center text-sm font-medium transition-colors"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Demos Overview
        </Link>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-secondary-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-secondary-700 dark:bg-secondary-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">
                Revenue Trend
              </h3>
              <div className="flex items-center gap-2">
                <span className="bg-brand h-3 w-3 rounded-full"></span>
                <span className="text-sm text-text-muted">This Month</span>
              </div>
            </div>
            <div className="flex h-64 items-end justify-between gap-2">
              {/* Simple bar chart representation */}
              {[
                { height: 'h-40', percent: '65%' },
                { height: 'h-52', percent: '85%' },
                { height: 'h-28', percent: '45%' },
                { height: 'h-48', percent: '75%' },
                { height: 'h-56', percent: '90%' },
                { height: 'h-32', percent: '55%' },
                { height: 'h-48', percent: '80%' },
                { height: 'h-60', percent: '95%' },
                { height: 'h-44', percent: '70%' },
                { height: 'h-36', percent: '60%' },
                { height: 'h-52', percent: '85%' },
                { height: 'h-64', percent: '100%' },
              ].map((bar, index) => (
                <div
                  key={index}
                  className={`from-brand to-brand/70 hover:from-brand-hover hover:to-brand flex-1 rounded-t-sm bg-gradient-to-t transition-all duration-300 ${bar.height}`}
                  title={bar.percent}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-text-muted">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Today's Revenue</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  $12,450
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">New Signups</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">1,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">2.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Transactions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {transactions.map(transaction => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed + User List */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Activity Feed */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Activity
            </h3>
            <div className="space-y-1">
              {activities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
          </div>

          {/* User List */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Team Members
            </h3>
            <div className="space-y-3">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="from-brand to-accent-700 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-medium text-white">
                      {user.name
                        .split(' ')
                        .map(n => n.charAt(0))
                        .join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        user.status === 'online'
                          ? 'bg-green-500'
                          : user.status === 'away'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                      }`}
                    ></div>
                    <span className="text-xs capitalize text-gray-500 dark:text-gray-400">
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
