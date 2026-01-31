import React, { useState } from 'react';
import { Plus, Edit, Eye, Building2, Trash2 } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Table } from '../Table';
import { Modal } from '../Modal';
import { Input, Select } from '../Input';

interface UnitsPageProps {
  onNavigate: (page: string, unitId?: string) => void;
}

export function UnitsPage({ onNavigate }: UnitsPageProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<typeof units[0] | null>(null);

  const units = [
    {
      id: 'U101',
      number: '101',
      property: 'Oakwood Apartments',
      type: '1 Bedroom',
      size: '750 sq ft',
      rent: '$1,200',
      tenant: 'Sarah Johnson',
      leaseEnd: '2025-06-30',
      status: 'Occupied',
    },
    {
      id: 'U102',
      number: '102',
      property: 'Oakwood Apartments',
      type: '2 Bedroom',
      size: '1,100 sq ft',
      rent: '$1,800',
      tenant: 'Michael Chen',
      leaseEnd: '2025-08-15',
      status: 'Occupied',
    },
    {
      id: 'U103',
      number: '103',
      property: 'Oakwood Apartments',
      type: '1 Bedroom',
      size: '750 sq ft',
      rent: '$1,200',
      tenant: '',
      leaseEnd: '',
      status: 'Vacant',
    },
    {
      id: 'U201',
      number: '205',
      property: 'Riverside Complex',
      type: '2 Bedroom',
      size: '1,100 sq ft',
      rent: '$1,500',
      tenant: 'Emily Rodriguez',
      leaseEnd: '2025-05-20',
      status: 'Occupied',
    },
    {
      id: 'U202',
      number: '302',
      property: 'Sunset Plaza',
      type: '3 Bedroom',
      size: '1,500 sq ft',
      rent: '$1,800',
      tenant: 'David Martinez',
      leaseEnd: '2025-12-01',
      status: 'Occupied',
    },
    {
      id: 'U203',
      number: '104',
      property: 'Green Valley',
      type: '2 Bedroom',
      size: '1,200 sq ft',
      rent: '$1,400',
      tenant: '',
      leaseEnd: '',
      status: 'Vacant',
    },
  ];

  const handleEdit = (unit: typeof units[0]) => {
    setSelectedUnit(unit);
    setShowEditModal(true);
  };

  const handleDelete = (unit: typeof units[0]) => {
    setSelectedUnit(unit);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Deleting unit:', selectedUnit?.number);
    setShowDeleteModal(false);
    setSelectedUnit(null);
  };

  const columns = [
    {
      key: 'number',
      header: 'Unit #',
      render: (unit: typeof units[0]) => (
        <div>
          <p className="text-[var(--color-gray-900)]">Unit {unit.number}</p>
          <p className="text-sm text-[var(--color-gray-500)]">{unit.type}</p>
        </div>
      ),
    },
    {
      key: 'property',
      header: 'Property',
      render: (unit: typeof units[0]) => (
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-[var(--color-gray-400)]" />
          <span className="text-[var(--color-gray-900)]">{unit.property}</span>
        </div>
      ),
    },
    {
      key: 'size',
      header: 'Size',
      render: (unit: typeof units[0]) => (
        <span className="text-[var(--color-gray-900)]">{unit.size}</span>
      ),
    },
    {
      key: 'rent',
      header: 'Monthly Rent',
      render: (unit: typeof units[0]) => (
        <span className="text-[var(--color-gray-900)]">{unit.rent}</span>
      ),
    },
    {
      key: 'tenant',
      header: 'Current Tenant',
      render: (unit: typeof units[0]) => (
        <div>
          {unit.tenant ? (
            <>
              <p className="text-[var(--color-gray-900)]">{unit.tenant}</p>
              {unit.leaseEnd && (
                <p className="text-sm text-[var(--color-gray-500)]">Until {unit.leaseEnd}</p>
              )}
            </>
          ) : (
            <span className="text-[var(--color-gray-400)]">No tenant</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (unit: typeof units[0]) => (
        <Badge variant={unit.status === 'Occupied' ? 'success' : 'warning'}>
          {unit.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (unit: typeof units[0]) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('unit-details', unit.id);
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
              handleEdit(unit);
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
              handleDelete(unit);
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
          <h1>Units</h1>
          <p className="mt-1 text-[var(--color-gray-600)]">
            Manage all units across your properties
          </p>
        </div>
        <Button icon={<Plus size={20} />} onClick={() => setShowAddModal(true)}>
          Add Unit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Total Units</p>
          <h2 className="mb-2">{units.length}</h2>
          <p className="text-sm text-[var(--color-gray-500)]">Across all properties</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Occupied</p>
          <h2 className="mb-2">{units.filter((u) => u.status === 'Occupied').length}</h2>
          <Badge variant="success">
            {Math.round((units.filter((u) => u.status === 'Occupied').length / units.length) * 100)}% Rate
          </Badge>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Vacant</p>
          <h2 className="mb-2">{units.filter((u) => u.status === 'Vacant').length}</h2>
          <Badge variant="warning">Available</Badge>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Total Revenue</p>
          <h2 className="mb-2">
            $
            {units
              .filter((u) => u.status === 'Occupied')
              .reduce((sum, u) => sum + parseInt(u.rent.replace(/[$,]/g, '')), 0)
              .toLocaleString()}
          </h2>
          <p className="text-sm text-[var(--color-gray-500)]">Monthly</p>
        </Card>
      </div>

      <Card padding="none">
        <Table
          data={units}
          columns={columns}
          searchable
          searchPlaceholder="Search units by number, property, or tenant..."
          onRowClick={(unit) => onNavigate('unit-details', unit.id)}
        />
      </Card>

      {/* Add Unit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Unit"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddModal(false)}>Add Unit</Button>
          </>
        }
      >
        <form className="space-y-5">
          <Select
            label="Property"
            options={[
              { value: '', label: 'Select property...' },
              { value: 'oakwood', label: 'Oakwood Apartments' },
              { value: 'riverside', label: 'Riverside Complex' },
              { value: 'sunset', label: 'Sunset Plaza' },
              { value: 'green', label: 'Green Valley' },
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Unit Number" placeholder="101" required />
            <Select
              label="Unit Type"
              options={[
                { value: '', label: 'Select type...' },
                { value: 'studio', label: 'Studio' },
                { value: '1br', label: '1 Bedroom' },
                { value: '2br', label: '2 Bedroom' },
                { value: '3br', label: '3 Bedroom' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input type="number" label="Size (sq ft)" placeholder="750" required />
            <Input type="number" label="Monthly Rent ($)" placeholder="1200" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input type="number" label="Bedrooms" placeholder="1" required />
            <Input type="number" label="Bathrooms" placeholder="1" required />
          </div>

          <Input label="Amenities" placeholder="AC, Dishwasher, Balcony" />
        </form>
      </Modal>

      {/* Edit Unit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUnit(null);
        }}
        title="Edit Unit"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowEditModal(false);
              setSelectedUnit(null);
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log('Updating unit:', selectedUnit?.number);
              setShowEditModal(false);
              setSelectedUnit(null);
            }}>
              Save Changes
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          <Select
            label="Property"
            defaultValue={selectedUnit?.property}
            options={[
              { value: '', label: 'Select property...' },
              { value: 'oakwood', label: 'Oakwood Apartments' },
              { value: 'riverside', label: 'Riverside Complex' },
              { value: 'sunset', label: 'Sunset Plaza' },
              { value: 'green', label: 'Green Valley' },
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Unit Number" 
              placeholder="101" 
              defaultValue={selectedUnit?.number}
              required 
            />
            <Select
              label="Unit Type"
              options={[
                { value: '', label: 'Select type...' },
                { value: 'studio', label: 'Studio' },
                { value: '1br', label: '1 Bedroom' },
                { value: '2br', label: '2 Bedroom' },
                { value: '3br', label: '3 Bedroom' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="number" 
              label="Size (sq ft)" 
              placeholder="750" 
              defaultValue={selectedUnit?.size.replace(' sq ft', '')}
              required 
            />
            <Input 
              type="number" 
              label="Monthly Rent ($)" 
              placeholder="1200" 
              defaultValue={selectedUnit?.rent.replace(/[$,]/g, '')}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input type="number" label="Bedrooms" placeholder="1" required />
            <Input type="number" label="Bathrooms" placeholder="1" required />
          </div>

          <Input label="Amenities" placeholder="AC, Dishwasher, Balcony" />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUnit(null);
        }}
        title="Delete Unit"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowDeleteModal(false);
              setSelectedUnit(null);
            }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete Unit
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
            Are you sure you want to delete <strong>Unit {selectedUnit?.number}</strong>? This will remove any leases and tenant data associated with this unit.
          </p>
        </div>
      </Modal>
    </div>
  );
}