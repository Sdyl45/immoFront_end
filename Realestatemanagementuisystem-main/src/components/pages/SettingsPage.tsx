import React, { useState } from 'react';
import { User, Shield, Bell, Building2, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Table } from '../Table';
import { Modal } from '../Modal';
import { Input, Select } from '../Input';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const users = [
    {
      id: 'U001',
      name: 'John Doe',
      email: 'john@immopoem.com',
      role: 'Administrator',
      status: 'Active',
      lastActive: '2024-12-09',
    },
    {
      id: 'U002',
      name: 'Jane Smith',
      email: 'jane@immopoem.com',
      role: 'Property Manager',
      status: 'Active',
      lastActive: '2024-12-08',
    },
    {
      id: 'U003',
      name: 'Bob Johnson',
      email: 'bob@immopoem.com',
      role: 'Maintenance Staff',
      status: 'Active',
      lastActive: '2024-12-07',
    },
  ];

  const roles = [
    {
      id: 'R001',
      name: 'Administrator',
      description: 'Full access to all features and settings',
      users: 1,
      permissions: ['All Permissions'],
    },
    {
      id: 'R002',
      name: 'Property Manager',
      description: 'Manage properties, units, tenants, and leases',
      users: 2,
      permissions: ['Properties', 'Units', 'Tenants', 'Leases', 'Invoices'],
    },
    {
      id: 'R003',
      name: 'Maintenance Staff',
      description: 'View and manage maintenance requests',
      users: 1,
      permissions: ['Properties (View)', 'Maintenance'],
    },
  ];

  const tabs = [
    { id: 'users', label: 'Users', icon: <User size={20} /> },
    { id: 'roles', label: 'Roles & Permissions', icon: <Shield size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'company', label: 'Company Info', icon: <Building2 size={20} /> },
  ];

  const userColumns = [
    {
      key: 'name',
      header: 'Name',
      render: (user: typeof users[0]) => (
        <div>
          <p className="text-[var(--color-gray-900)]">{user.name}</p>
          <p className="text-sm text-[var(--color-gray-500)]">{user.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: typeof users[0]) => (
        <Badge variant="info">{user.role}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: typeof users[0]) => (
        <Badge variant={user.status === 'Active' ? 'success' : 'default'}>
          {user.status}
        </Badge>
      ),
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      render: (user: typeof users[0]) => (
        <p className="text-sm text-[var(--color-gray-900)]">{user.lastActive}</p>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Edit size={16} />}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" icon={<Trash2 size={16} />}>
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="mt-1 text-[var(--color-gray-600)]">
          Manage users, roles, and system preferences
        </p>
      </div>

      <div className="flex gap-2 border-b border-[var(--color-gray-200)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-[var(--color-primary-600)] text-[var(--color-primary-600)]'
                : 'border-transparent text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>User Management</h3>
              <p className="text-sm text-[var(--color-gray-600)] mt-1">
                Manage user accounts and access
              </p>
            </div>
            <Button icon={<Plus size={20} />} onClick={() => setShowAddUserModal(true)}>
              Add User
            </Button>
          </div>

          <Card padding="none">
            <Table data={users} columns={userColumns} searchable searchPlaceholder="Search users..." />
          </Card>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>Roles & Permissions</h3>
              <p className="text-sm text-[var(--color-gray-600)] mt-1">
                Define user roles and their permissions
              </p>
            </div>
            <Button icon={<Plus size={20} />}>Add Role</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="mb-1">{role.name}</h4>
                    <p className="text-sm text-[var(--color-gray-600)]">{role.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" icon={<Edit size={16} />} />
                </div>

                <div className="mb-4 py-3 border-y border-[var(--color-gray-200)]">
                  <p className="text-sm text-[var(--color-gray-600)] mb-1">Users</p>
                  <p className="text-[var(--color-gray-900)]">{role.users} assigned</p>
                </div>

                <div>
                  <p className="text-sm text-[var(--color-gray-600)] mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {role.permissions.map((permission, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader title="Notification Preferences" subtitle="Configure how you receive notifications" />
          <div className="space-y-4">
            {[
              { label: 'Email notifications for new payments', checked: true },
              { label: 'Email notifications for overdue invoices', checked: true },
              { label: 'Email notifications for new lease applications', checked: true },
              { label: 'Email notifications for maintenance requests', checked: false },
              { label: 'SMS notifications for urgent issues', checked: true },
              { label: 'Weekly summary reports', checked: true },
            ].map((pref, index) => (
              <label key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-gray-50)] cursor-pointer">
                <input type="checkbox" defaultChecked={pref.checked} className="rounded border-[var(--color-gray-300)]" />
                <span className="text-[var(--color-gray-900)]">{pref.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[var(--color-gray-200)]">
            <Button>Save Preferences</Button>
          </div>
        </Card>
      )}

      {activeTab === 'company' && (
        <Card>
          <CardHeader title="Company Information" subtitle="Update your company details" />
          <form className="space-y-5">
            <Input label="Company Name" defaultValue="ImmoPoem Real Estate" required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email" type="email" defaultValue="contact@immopoem.com" required />
              <Input label="Phone" type="tel" defaultValue="(555) 123-4567" required />
            </div>

            <Input label="Address" defaultValue="123 Business Ave" required />

            <div className="grid grid-cols-3 gap-4">
              <Input label="City" defaultValue="New York" required />
              <Input label="State" defaultValue="NY" required />
              <Input label="ZIP Code" defaultValue="10001" required />
            </div>

            <Input label="Website" placeholder="https://immopoem.com" />

            <div className="pt-4">
              <Button>Update Information</Button>
            </div>
          </form>
        </Card>
      )}

      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Add New User"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddUserModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddUserModal(false)}>Add User</Button>
          </>
        }
      >
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" required />
            <Input label="Last Name" placeholder="Doe" required />
          </div>

          <Input label="Email Address" type="email" placeholder="john@immopoem.com" required />

          <Select
            label="Role"
            options={[
              { value: '', label: 'Select role...' },
              { value: 'admin', label: 'Administrator' },
              { value: 'manager', label: 'Property Manager' },
              { value: 'maintenance', label: 'Maintenance Staff' },
            ]}
            required
          />

          <Input label="Temporary Password" type="password" placeholder="••••••••" required helperText="User will be prompted to change on first login" />
        </form>
      </Modal>
    </div>
  );
}
