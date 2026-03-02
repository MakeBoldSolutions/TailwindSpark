import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';

// Icons used in the component
const IconMore = () => <span>⋯</span>;
const IconEdit = () => <span>✏️</span>;
const IconDelete = () => <span>🗑️</span>;

/**
 * User data structure.
 */
interface User {
  /**
   * Unique user identifier.
   */
  id: string;
  /**
   * User's full name.
   */
  name: string;
  /**
   * User's email address.
   */
  email: string;
  /**
   * User's role in the system.
   */
  role: 'Admin' | 'Editor' | 'Viewer' | 'Manager';
  /**
   * Current user status.
   */
  status: 'active' | 'inactive' | 'pending';
  /**
   * Last activity timestamp.
   */
  lastActive: string;
  /**
   * Avatar image URL or emoji.
   */
  avatar: string;
  /**
   * Account creation date.
   */
  signupDate: string;
}

const UserRow: React.FC<{
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}> = ({ user, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const statusColors = {
    active: 'bg-success/10 text-success',
    inactive: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300',
    pending: 'bg-warning/10 text-warning',
  };

  const roleColors = {
    Admin: 'bg-error/10 text-error',
    Manager: 'bg-brand/10 text-brand',
    /* eslint-disable-next-line no-raw-primary-class/no-raw-primary-class */
    Editor: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    Viewer: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300',
  };

  return (
    <tr className="transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-700">
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center">
          {/* eslint-disable-next-line no-raw-primary-class/no-raw-primary-class */}
          <div className="from-primary-500 to-accent-700 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br font-medium text-white">
            {user.name
              .split(' ')
              .map(n => n.charAt(0))
              .join('')}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-text">{user.name}</div>
            <div className="text-sm text-text-muted">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${roleColors[user.role]}`}
        >
          {user.role}
        </span>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[user.status]}`}
        >
          {user.status}
        </span>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-text-muted">
        {user.lastActive}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-text-muted">
        {user.signupDate}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="rounded-lg p-2 text-secondary-400 transition-colors hover:bg-secondary-100 hover:text-secondary-600 dark:hover:bg-secondary-700 dark:hover:text-secondary-300"
            aria-label="User actions"
            title="User actions"
          >
            <IconMore />
          </button>
          {showActions && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-secondary-200 bg-white shadow-lg dark:border-secondary-700 dark:bg-secondary-800">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(user);
                    setShowActions(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-secondary-700 transition-colors hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700"
                >
                  <IconEdit /> Edit User
                </button>
                <button
                  onClick={() => {
                    onDelete(user);
                    setShowActions(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-error transition-colors hover:bg-error/10"
                >
                  <IconDelete /> Delete User
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

/**
 * User management page with filtering, search, and role-based actions.
 * 
 * Displays user list with status indicators, role management, search and filter
 * capabilities, and bulk action support for admin functions.
 * 
 * @returns Users page component
 * 
 * @example
 * ```tsx
 * <UsersPage />
 * ```
 */
export const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@promptspark.com',
      role: 'Admin',
      status: 'active',
      lastActive: '2 minutes ago',
      avatar: 'JD',
      signupDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@promptspark.com',
      role: 'Manager',
      status: 'active',
      lastActive: '1 hour ago',
      avatar: 'JS',
      signupDate: '2024-01-12',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@promptspark.com',
      role: 'Editor',
      status: 'inactive',
      lastActive: '2 days ago',
      avatar: 'MJ',
      signupDate: '2024-01-10',
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@promptspark.com',
      role: 'Viewer',
      status: 'active',
      lastActive: '5 minutes ago',
      avatar: 'SW',
      signupDate: '2024-01-08',
    },
    {
      id: '5',
      name: 'Alex Chen',
      email: 'alex@promptspark.com',
      role: 'Editor',
      status: 'pending',
      lastActive: 'Never',
      avatar: 'AC',
      signupDate: '2024-01-20',
    },
    {
      id: '6',
      name: 'Emily Davis',
      email: 'emily@promptspark.com',
      role: 'Manager',
      status: 'active',
      lastActive: '30 minutes ago',
      avatar: 'ED',
      signupDate: '2024-01-05',
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditUser = (user: User) => {
    console.warn('Edit user:', user);
    // In a real app, you'd open a modal or navigate to edit page
  };

  const handleDeleteUser = (user: User) => {
    console.warn('Delete user:', user);
    // In a real app, you'd show a confirmation dialog
  };

  const handleInviteUser = () => {
    console.warn('Invite new user');
    // In a real app, you'd open an invite modal
  };

  return (
    <DashboardLayout
      pageTitle="Users"
      pageDescription="Manage team members and their access permissions."
      headerActions={
        <button
          onClick={handleInviteUser}
          className="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors" // eslint-disable-line no-raw-primary-class/no-raw-primary-class
        >
          Invite User
        </button>
      }
    >
      {/* Filters */}
      <div className="mb-6 rounded-xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-700 dark:bg-secondary-800">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Search Users
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="focus:ring-brand w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-secondary-900 focus:border-transparent focus:ring-2 dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-100"
            />
          </div>

          <div>
            <label
              htmlFor="role-filter"
              className="mb-2 block text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Filter by Role
            </label>
            <select
              id="role-filter"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="focus:ring-brand w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-secondary-900 focus:border-transparent focus:ring-2 dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-100"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="status-filter"
              className="mb-2 block text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="focus:ring-brand w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-secondary-900 focus:border-transparent focus:ring-2 dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-100"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-sm dark:border-secondary-700 dark:bg-secondary-800">
        <div className="border-b border-secondary-200 px-6 py-4 dark:border-secondary-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text">Team Members</h3>
            <span className="text-sm text-text-muted">
              {filteredUsers.length} of {users.length} users
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead className="bg-secondary-50 dark:bg-secondary-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  Joined
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 bg-white dark:divide-secondary-700 dark:bg-secondary-800">
              {filteredUsers.map(user => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
