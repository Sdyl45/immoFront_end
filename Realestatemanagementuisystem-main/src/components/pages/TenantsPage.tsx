import React, { useState } from 'react';
import { Plus, Edit, Eye, Mail, Phone, Building2, Trash2 } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Table } from '../Table';
import { Modal } from '../Modal';
import { Input, Select } from '../Input';

interface TenantsPageProps {
  onNavigate: (page: string, tenantId?: string) => void;
}

export function TenantsPage({ onNavigate }: TenantsPageProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<typeof tenants[0] | null>(null);

  const tenants = [
    {
      id: 'T001',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 123-4567',
      unit: 'Unit 101',
      property: 'Oakwood Apartments',
      leaseStart: '2024-07-01',
      leaseEnd: '2025-06-30',
      rent: '$1,200',
      status: 'Active',
      paymentStatus: 'Current',
    },
    {
      id: 'T002',
      name: 'Michael Chen',
      email: 'mchen@email.com',
      phone: '(555) 234-5678',
      unit: 'Unit 102',
      property: 'Oakwood Apartments',
      leaseStart: '2024-09-01',
      leaseEnd: '2025-08-31',
      rent: '$1,800',
      status: 'Active',
      paymentStatus: 'Current',
    },
    {
      id: 'T003',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '(555) 345-6789',
      unit: 'Unit 205',
      property: 'Riverside Complex',
      leaseStart: '2024-06-01',
      leaseEnd: '2025-05-31',
      rent: '$1,500',
      status: 'Active',
      paymentStatus: 'Late',
    },
    {
      id: 'T004',
      name: 'David Martinez',
      email: 'dmartinez@email.com',
      phone: '(555) 456-7890',
      unit: 'Unit 302',
      property: 'Sunset Plaza',
      leaseStart: '2023-12-01',
      leaseEnd: '2024-11-30',
      rent: '$1,800',
      status: 'Expiring Soon',
      paymentStatus: 'Current',
    },
  ];

  const handleEdit = (tenant: typeof tenants[0]) => {
    setSelectedTenant(tenant);
    setShowEditModal(true);
  };

  const handleDelete = (tenant: typeof tenants[0]) => {
    setSelectedTenant(tenant);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Deleting tenant:', selectedTenant?.name);
    setShowDeleteModal(false);
    setSelectedTenant(null);
  };

  const columns = [
    {
      key: 'name',
      header: 'Tenant Name',
      render: (tenant: typeof tenants[0]) => (
        <div>
          <p className="text-[var(--color-gray-900)]">{tenant.name}</p>
          <p className="text-sm text-[var(--color-gray-500)] flex items-center gap-1">
            <Mail size={12} />
            {tenant.email}
          </p>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (tenant: typeof tenants[0]) => (
        <p className="text-[var(--color-gray-900)] flex items-center gap-1">
          <Phone size={14} />
          {tenant.phone}
        </p>
      ),
    },
    {
      key: 'unit',
      header: 'Unit & Property',
      render: (tenant: typeof tenants[0]) => (
        <div>
          <p className="text-[var(--color-gray-900)]">{tenant.unit}</p>
          <p className="text-sm text-[var(--color-gray-500)] flex items-center gap-1">
            <Building2 size={12} />
            {tenant.property}
          </p>
        </div>
      ),
    },
    {
      key: 'lease',
      header: 'Lease Period',
      render: (tenant: typeof tenants[0]) => (
        <div>
          <p className="text-sm text-[var(--color-gray-900)]">{tenant.leaseStart}</p>
          <p className="text-sm text-[var(--color-gray-500)]">to {tenant.leaseEnd}</p>
        </div>
      ),
    },
    {
      key: 'rent',
      header: 'Monthly Rent',
      render: (tenant: typeof tenants[0]) => (
        <p className="text-[var(--color-gray-900)]">{tenant.rent}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tenant: typeof tenants[0]) => (
        <div className="space-y-1">
          <Badge variant={tenant.status === 'Active' ? 'success' : 'warning'}>
            {tenant.status}
          </Badge>
          <Badge variant={tenant.paymentStatus === 'Current' ? 'success' : 'danger'} size="sm">
            {tenant.paymentStatus}
          </Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (tenant: typeof tenants[0]) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('tenant-details', tenant.id);
            }}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(tenant);
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(tenant);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Tenants</h1>
          <p className="mt-1 text-[var(--color-gray-600)]">
            Manage tenant information and relationships
          </p>
        </div>
        <Button icon={<Plus size={20} />} onClick={() => setShowAddModal(true)}>
          Add Tenant
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Total Tenants</p>
          <h2 className="mb-2">{tenants.length}</h2>
          <p className="text-sm text-[var(--color-gray-500)]">Active residents</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Current Payments</p>
          <h2 className="mb-2">{tenants.filter((t) => t.paymentStatus === 'Current').length}</h2>
          <Badge variant="success">Up to date</Badge>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Late Payments</p>
          <h2 className="mb-2">{tenants.filter((t) => t.paymentStatus === 'Late').length}</h2>
          <Badge variant="danger">Requires attention</Badge>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Expiring Leases</p>
          <h2 className="mb-2">{tenants.filter((t) => t.status === 'Expiring Soon').length}</h2>
          <Badge variant="warning">Next 30 days</Badge>
        </Card>
      </div>

      <Card padding="none">
        <Table
          data={tenants}
          columns={columns}
          searchable
          searchPlaceholder="Search tenants by name, email, or unit..."
          onRowClick={(tenant) => onNavigate('tenant-details', tenant.id)}
        />
      </Card>

      {/* Add Tenant Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Tenant"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddModal(false)}>Add Tenant</Button>
          </>
        }
      >
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" required />
            <Input label="Last Name" placeholder="Doe" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" placeholder="john@email.com" required />
            <Input label="Phone" type="tel" placeholder="(555) 123-4567" required />
          </div>

          <Input label="Date of Birth" type="date" required />

          <Input label="Emergency Contact Name" placeholder="Jane Doe" />
          <Input label="Emergency Contact Phone" type="tel" placeholder="(555) 987-6543" />

          <Input label="Previous Address" placeholder="123 Previous St, City, State ZIP" />

          <Select
            label="Employment Status"
            options={[
              { value: '', label: 'Select status...' },
              { value: 'employed', label: 'Employed Full-Time' },
              { value: 'self', label: 'Self-Employed' },
              { value: 'retired', label: 'Retired' },
              { value: 'student', label: 'Student' },
            ]}
          />
        </form>
      </Modal>

      {/* Edit Tenant Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTenant(null);
        }}
        title="Edit Tenant"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowEditModal(false);
              setSelectedTenant(null);
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log('Updating tenant:', selectedTenant?.name);
              setShowEditModal(false);
              setSelectedTenant(null);
            }}>
              Save Changes
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="First Name" 
              placeholder="John" 
              defaultValue={selectedTenant?.name.split(' ')[0]}
              required 
            />
            <Input 
              label="Last Name" 
              placeholder="Doe" 
              defaultValue={selectedTenant?.name.split(' ')[1]}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Email" 
              type="email" 
              placeholder="john@email.com" 
              defaultValue={selectedTenant?.email}
              required 
            />
            <Input 
              label="Phone" 
              type="tel" 
              placeholder="(555) 123-4567" 
              defaultValue={selectedTenant?.phone}
              required 
            />
          </div>

          <Input label="Date of Birth" type="date" required />

          <Input label="Emergency Contact Name" placeholder="Jane Doe" />
          <Input label="Emergency Contact Phone" type="tel" placeholder="(555) 987-6543" />

          <Input label="Previous Address" placeholder="123 Previous St, City, State ZIP" />

          <Select
            label="Employment Status"
            options={[
              { value: '', label: 'Select status...' },
              { value: 'employed', label: 'Employed Full-Time' },
              { value: 'self', label: 'Self-Employed' },
              { value: 'retired', label: 'Retired' },
              { value: 'student', label: 'Student' },
            ]}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTenant(null);
        }}
        title="Delete Tenant"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowDeleteModal(false);
              setSelectedTenant(null);
            }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete Tenant
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-[var(--color-danger-50)] rounded-lg border border-[var(--color-danger-200)]">
            <Trash2 size={24} className="text-[var(--color-danger-600)]" />
            <div>
              <p className="text-[var(--color-gray-900)]">This action cannot be undone</p>
              <p className="text-sm text-[var(--color-gray-600)]">All associated data will be permanently removed</p>
            </div>
          </div>
          <p className="text-[var(--color-gray-700)]">
            Are you sure you want to delete <strong>{selectedTenant?.name}</strong>? This will remove their lease, payment history, and all related data.
          </p>
        </div>
      </Modal>
    </div>
  );
}