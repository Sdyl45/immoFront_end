import React, { useState,useEffect } from 'react';
import { Plus, Edit, Eye, FileText, Calendar, Trash2 } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Table } from '../Table';
import axios from 'axios';
import { API_URL } from '../../../config';
interface LeasesPageProps {
  onNavigate: (page: string, leaseId?: string) => void;
  onCreateLease: () => void;
}

export function LeasesPage({ onNavigate, onCreateLease }: LeasesPageProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState<typeof leases[0] | null>(null);

  const leases = [
    {
      id: 'L001',
      leaseNumber: 'LSE-2024-001',
      tenant: 'Sarah Johnson',
      property: 'Oakwood Apartments',
      unit: 'Unit 101',
      startDate: '2024-07-01',
      endDate: '2025-06-30',
      rent: '$1,200',
      deposit: '$2,400',
      status: 'Active',
    },
    {
      id: 'L002',
      leaseNumber: 'LSE-2024-002',
      tenant: 'Michael Chen',
      property: 'Oakwood Apartments',
      unit: 'Unit 102',
      startDate: '2024-09-01',
      endDate: '2025-08-31',
      rent: '$1,800',
      deposit: '$3,600',
      status: 'Active',
    },
    {
      id: 'L003',
      leaseNumber: 'LSE-2024-003',
      tenant: 'Emily Rodriguez',
      property: 'Riverside Complex',
      unit: 'Unit 205',
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      rent: '$1,500',
      deposit: '$3,000',
      status: 'Active',
    },
    {
      id: 'L004',
      leaseNumber: 'LSE-2023-045',
      tenant: 'David Martinez',
      property: 'Sunset Plaza',
      unit: 'Unit 302',
      startDate: '2023-12-01',
      endDate: '2024-11-30',
      rent: '$1,800',
      deposit: '$3,600',
      status: 'Expiring Soon',
    },
    {
      id: 'L005',
      leaseNumber: 'LSE-2025-001',
      tenant: 'Jessica Brown',
      property: 'Green Valley',
      unit: 'Unit 104',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      rent: '$1,400',
      deposit: '$2,800',
      status: 'Upcoming',
    },
  ];
  const [bailData, setBailData] = useState({
    total_bails: 0,
    active_leases: 0,
    expiring_soon: 0,
    upcoming_leases: 0,
    total_monthly_revenue:0
      });
  const fetchbails = async () => {
    try {
      const response = await axios.get(`${API_URL}/BailDashboard/`);
      setBailData({
        total_bails: response.data['total_bails'] || 0,
        active_leases: response.data['active_leases']['count'] || 0,
        expiring_soon: response.data['expiring_soon']['count'] || 0,
        upcoming_leases: response.data['upcoming_leases']['count'] || 0,
        total_monthly_revenue: response.data['total_monthly_revenue'] || 0
      });
    } catch (error) {
      console.error('Error fetching bails:', error);
    }
  };
   useEffect(() => {
    fetchbails();
    }, []);
  const handleDelete = (lease: typeof leases[0]) => {
    setSelectedLease(lease);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Deleting lease:', selectedLease?.leaseNumber);
    setShowDeleteModal(false);
    setSelectedLease(null);
  };

  const columns = [
    {
      key: 'leaseNumber',
      header: 'Lease Number',
      render: (lease: typeof leases[0]) => (
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[var(--color-gray-400)]" />
          <span className="text-[var(--color-gray-900)]">{lease.leaseNumber}</span>
        </div>
      ),
    },
    {
      key: 'tenant',
      header: 'Tenant',
      render: (lease: typeof leases[0]) => (
        <p className="text-[var(--color-gray-900)]">{lease.tenant}</p>
      ),
    },
    {
      key: 'location',
      header: 'Property & Unit',
      render: (lease: typeof leases[0]) => (
        <div>
          <p className="text-[var(--color-gray-900)]">{lease.unit}</p>
          <p className="text-sm text-[var(--color-gray-500)]">{lease.property}</p>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Lease Period',
      render: (lease: typeof leases[0]) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar size={14} className="text-[var(--color-gray-400)]" />
          <span className="text-[var(--color-gray-900)]">{lease.startDate}</span>
          <span className="text-[var(--color-gray-500)]">→</span>
          <span className="text-[var(--color-gray-900)]">{lease.endDate}</span>
        </div>
      ),
    },
    {
      key: 'rent',
      header: 'Monthly Rent',
      render: (lease: typeof leases[0]) => (
        <p className="text-[var(--color-gray-900)]">{lease.rent}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (lease: typeof leases[0]) => (
        <Badge
          variant={
            lease.status === 'Active'
              ? 'success'
              : lease.status === 'Upcoming'
              ? 'info'
              : lease.status === 'Expiring Soon'
              ? 'warning'
              : 'default'
          }
        >
          {lease.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (lease: typeof leases[0]) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('lease-details', lease.id);
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
              onCreateLease();
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
              handleDelete(lease);
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
          <h1>Leases</h1>
          <p className="mt-1 text-[var(--color-gray-600)]">
            Manage lease agreements and contracts
          </p>
        </div>
        <Button icon={<Plus size={20} />} onClick={onCreateLease}>
          Create New Lease
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Active Leases</p>
          <h2 className="mb-2">{bailData.total_bails}</h2>
          <Badge variant="success">Currently active</Badge>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Expiring Soon</p>
          <h2 className="mb-2">{bailData.expiring_soon}</h2>
          <Badge variant="warning">Next 60 days</Badge>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Upcoming</p>
          <h2 className="mb-2">{bailData.upcoming_leases}</h2>
          <Badge variant="info">Starting soon</Badge>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Total Revenue</p>
          <h2 className="mb-2">
            $
            {bailData.total_monthly_revenue}
          </h2>
          <p className="text-sm text-[var(--color-gray-500)]">Monthly</p>
        </Card>
      </div>

      <Card padding="none">
        <Table
          data={leases}
          columns={columns}
          searchable
          searchPlaceholder="Search leases by number, tenant, or property..."
          onRowClick={(lease) => onNavigate('lease-details', lease.id)}
        />
      </Card>

      {/* Delete Confirmation Modal - Import Modal component first */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="mb-4">Delete Lease</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-[var(--color-danger-50)] rounded-lg border border-[var(--color-danger-200)]">
                <Trash2 size={24} className="text-[var(--color-danger-600)]" />
                <div>
                  <p className="text-[var(--color-gray-900)]">This action cannot be undone</p>
                  <p className="text-sm text-[var(--color-gray-600)]">All associated data will be permanently removed</p>
                </div>
              </div>
              <p className="text-[var(--color-gray-700)]">
                Are you sure you want to delete lease <strong>{selectedLease?.leaseNumber}</strong>? This will remove all invoices, payments, and associated data.
              </p>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <Button variant="secondary" onClick={() => {
                setShowDeleteModal(false);
                setSelectedLease(null);
              }}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete Lease
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}