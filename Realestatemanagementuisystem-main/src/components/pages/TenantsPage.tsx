import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Edit, Eye, Mail, Phone, Building2, 
  Trash2, Search, Calendar, DollarSign, User, 
  ArrowUpRight, ArrowDownRight, Filter, X, Check, AlertCircle
} from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Table } from '../Table';
import { Modal } from '../Modal';
import { Input, Select, TextArea } from '../Input';
import styles from './TenantsPage.module.scss';
import axios from 'axios';
import { API_URL } from '../../../config';

// Types
type TenantStatus = 'active' | 'inactive' | 'pending' | 'overdue';
type PaymentStatus = 'current' | 'late' | 'paid' | 'unpaid';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  property: string;
  propertyId: string;
  leaseStart: string;
  leaseEnd: string;
  rent: number;
  status: TenantStatus;
  paymentStatus: PaymentStatus;
  emergencyContact?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface TenantsPageProps {
  onNavigate: (page: string, tenantId?: string) => void;
  onLogout: () => void;
}

export function TenantsPage({ onNavigate, onLogout }: TenantsPageProps) {
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: '',
    email: '',
    phone: '',
    unit: '',
    property: '',
    propertyId: '',
    leaseStart: '',
    leaseEnd: '',
    rent: 0,
    status: 'active',
    paymentStatus: 'current',
    emergencyContact: '',
    notes: ''
  });

  // Mock data - Replace with API call in production
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: 'T001',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 123-4567',
      unit: 'Unit 101',
      property: 'Oakwood Apartments',
      propertyId: 'P001',
      leaseStart: '2024-07-01',
      leaseEnd: '2025-06-30',
      rent: 1200,
      status: 'active',
      paymentStatus: 'current',
      emergencyContact: 'John Johnson (555) 765-4321',
      notes: 'Pays rent on time. Very responsible tenant.',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'T002',
      name: 'Michael Chen',
      email: 'mchen@email.com',
      phone: '(555) 234-5678',
      unit: 'Unit 102',
      property: 'Oakwood Apartments',
      propertyId: 'P001',
      leaseStart: '2024-09-01',
      leaseEnd: '2025-08-31',
      rent: 1800,
      status: 'active',
      paymentStatus: 'current',
      emergencyContact: 'Lisa Chen (555) 876-5432',
      notes: 'Works from home. Prefers email communication.',
      createdAt: '2024-02-20T14:15:00Z',
      updatedAt: '2024-02-20T14:15:00Z'
    },
    {
      id: 'T003',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '(555) 345-6789',
      unit: 'Unit 205',
      property: 'Riverside Complex',
      propertyId: 'P002',
      leaseStart: '2024-06-01',
      leaseEnd: '2025-05-31',
      rent: 1500,
      status: 'active',
      paymentStatus: 'late',
      emergencyContact: 'Carlos Rodriguez (555) 987-6543',
      notes: 'Rent payment is 5 days late. Following up.',
      createdAt: '2024-03-10T09:45:00Z',
      updatedAt: '2024-03-10T09:45:00Z'
    },
    {
      id: 'T004',
      name: 'David Martinez',
      email: 'dmartinez@email.com',
      phone: '(555) 456-7890',
      unit: 'Unit 302',
      property: 'Sunset Plaza',
      propertyId: 'P003',
      leaseStart: '2023-12-01',
      leaseEnd: '2024-11-30',
      rent: 1800,
      status: 'pending',
      paymentStatus: 'unpaid',
      emergencyContact: 'Maria Martinez (555) 123-9876',
      notes: 'New tenant. Move-in scheduled for next week.',
      createdAt: '2024-04-05T16:20:00Z',
      updatedAt: '2024-04-05T16:20:00Z'
    },
    {
      id: 'T005',
      name: 'Jennifer Lee',
      email: 'jennifer.lee@email.com',
      phone: '(555) 567-8901',
      unit: 'Unit 105',
      property: 'Sunset Plaza',
      propertyId: 'P003',
      leaseStart: '2023-11-15',
      leaseEnd: '2024-11-14',
      rent: 1950,
      status: 'active',
      paymentStatus: 'current',
      emergencyContact: 'Robert Lee (555) 234-5678',
      notes: 'Long-term tenant. Very reliable.',
      createdAt: '2023-11-10T11:20:00Z',
      updatedAt: '2024-03-15T10:30:00Z'
    }
  ]);
  const [tenantData, setTenantData] = useState({
    total_tenants: 0,
    current_payments: 0,
    late_payments: 0,
    expiring_leases: 0,
    tenants:[]
    });
  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/tenantsDashboard`);
      
      setTenantData({
        total_tenants: response.data['total_tenants'] || 0,
        current_payments: response.data['current_payments'] || 0,
        late_payments: response.data['late_payments'] || 0,
        expiring_leases: response.data['expiring_leases'] || 0,
        tenants: response.data['tenants'] || []
      });
      
      
      
    } catch (error) {
      console.error('Error fetching units:', error);
      // En cas d'erreur, définir des valeurs par défaut
      setTenantData({
        total_units: 0,
        occupied_units: 0,
        vacant_units: 0,
        total_revenue: 0
      });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchTenants();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call
    console.log('Form submitted:', formData);
    
    if (selectedTenant) {
      // Update existing tenant
      setTenants(prev => 
        prev.map(t => 
          t.id === selectedTenant.id ? { ...t, ...formData } as Tenant : t
        )
      );
      setShowEditModal(false);
    } else {
      // Add new tenant
      const newTenant: Tenant = {
        ...formData as Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>,
        id: `T${(tenants.length + 1000).toString().padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTenants(prev => [newTenant, ...prev]);
      setShowAddModal(false);
    }
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      unit: '',
      property: '',
      propertyId: '',
      leaseStart: '',
      leaseEnd: '',
      rent: 0,
      status: 'active',
      paymentStatus: 'current',
      emergencyContact: '',
      notes: ''
    });
    setSelectedTenant(null);
  };

  // Handle edit
  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      unit: tenant.unit,
      property: tenant.property,
      propertyId: tenant.propertyId,
      leaseStart: tenant.leaseStart,
      leaseEnd: tenant.leaseEnd,
      rent: tenant.rent,
      status: tenant.status,
      paymentStatus: tenant.paymentStatus,
      emergencyContact: tenant.emergencyContact,
      notes: tenant.notes
    });
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedTenant) {
      setTenants(prev => prev.filter(t => t.id !== selectedTenant.id));
      setShowDeleteModal(false);
      setSelectedTenant(null);
    }
  };

  // Get unique properties for filter
  const properties = useMemo(() => {
    const uniqueProperties = new Set<string>();
    tenants.forEach(tenant => uniqueProperties.add(tenant.property));
    return Array.from(uniqueProperties);
  }, [tenants]);

  // Filter and paginate tenants
  const filteredTenants = useMemo(() => {
    return tenants
      .filter(tenant => {
        const matchesSearch = 
          tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tenant.phone.includes(searchQuery) ||
          tenant.unit.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
        const matchesProperty = propertyFilter === 'all' || tenant.property === propertyFilter;
        
        return matchesSearch && matchesStatus && matchesProperty;
      });
  }, [tenants, searchQuery, statusFilter, propertyFilter]);

  // Pagination
  const paginatedTenants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTenants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTenants, currentPage]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalTenants = tenants.length;
    const activeTenants = tenants.filter(t => t.status === 'active').length;
    const pendingTenants = tenants.filter(t => t.status === 'pending').length;
    const latePayments = tenants.filter(t => t.paymentStatus === 'late').length;
    const totalRent = tenants.reduce((sum, tenant) => sum + (tenant.rent || 0), 0);
    
    return {
      totalTenants,
      activeTenants,
      pendingTenants,
      latePayments,
      totalRent,
      occupancyRate: totalTenants > 0 ? Math.round((activeTenants / totalTenants) * 100) : 0
    };
  }, [tenants]);

  // Table columns
  const columns = [
    {
      key: 'name',
      header: 'Tenant',
      render: (tenant: Tenant) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
            {tenant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{tenant.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Mail size={12} />
              {tenant.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (tenant: Tenant) => (
        <div className="space-y-1">
          <p className="text-gray-900 flex items-center gap-2">
            <Phone size={14} className="text-gray-500" />
            {tenant.phone}
          </p>
          {tenant.emergencyContact && (
            <p className="text-xs text-gray-500">
              <span className="font-medium">Emergency:</span> {tenant.emergencyContact.split('(')[0].trim()}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'property',
      header: 'Property',
      render: (tenant: Tenant) => (
        <div>
          <p className="font-medium text-gray-900">{tenant.unit}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Building2 size={12} className="text-gray-400" />
            {tenant.property}
          </p>
        </div>
      ),
    },
    {
      key: 'lease',
      header: 'Lease',
      render: (tenant: Tenant) => {
        const endDate = new Date(tenant.leaseEnd);
        const today = new Date();
        const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0;
        const isExpired = daysRemaining < 0;
        
        return (
          <div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-sm font-medium">
                {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
              </span>
            </div>
            {isExpiringSoon && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                {daysRemaining} days left
              </span>
            )}
            {isExpired && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                Expired
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'rent',
      header: 'Rent',
      render: (tenant: Tenant) => (
        <div>
          <p className="font-medium text-gray-900">
            ${tenant.rent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            <span className="text-gray-500 text-sm font-normal">/mo</span>
          </p>
          <p className="text-sm">
            <span className={classNames(
              'inline-flex items-center gap-1',
              tenant.paymentStatus === 'late' ? 'text-red-600' : 'text-green-600'
            )}>
              {tenant.paymentStatus === 'late' ? (
                <>
                  <AlertCircle size={12} />
                  <span>Overdue</span>
                </>
              ) : (
                <>
                  <Check size={12} />
                  <span>Paid</span>
                </>
              )}
            </span>
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tenant: Tenant) => (
        <div className="flex flex-col gap-1">
          <span className={classNames(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            tenant.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : tenant.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          )}>
            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
          </span>
          {tenant.paymentStatus === 'late' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Payment Overdue
            </span>
          )}
        </div>
      )
    },
          {
            key: 'actions',
            header: '',
            render: (tenant: Tenant) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => onNavigate('tenant-details', tenant.id)}
                  className="text-gray-400 hover:text-gray-500 p-1.5 rounded-full hover:bg-gray-100"
                  title="View details"
                >
                  <Eye size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(tenant)}
                  className="text-blue-600 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50"
                  title="Edit tenant"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(tenant)}
                  className="text-red-600 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50"
                  title="Delete tenant"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ),
          },
        ];

  // Helper function for conditional class names
  function classNames(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(' ');
  }

  // Render loading state
  if (isLoading && tenants.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <div className="mt-2">
              <button
                type="button"
                onClick={fetchTenants}
                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div>
          <h1>Tenants</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your tenants and their lease information
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          variant="primary"
          className="flex-shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </header>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Tenants</p>
            <h3>{tenantData.total_tenants}</h3>
            <p className={styles.statTrend}>
              <ArrowUpRight className="h-4 w-4" />
              <span>12% from last month</span>
            </p>
          </div>
          <div className={styles.statIcon}>
            <User size={20} className="text-blue-500" />
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Current Payment</p>
            <h3>{tenantData.current_payments}</h3>
            <p className={styles.statTrend}>
              <ArrowUpRight className="h-4 w-4" />
              <span>{tenantData.current_payments}% occupancy</span>
            </p>                      
          </div>
          <div className={styles.statIcon}>
            <Check size={20} className="text-green-500" />
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Late Payment</p>
            <h3>{tenantData.late_payments}</h3>
            <p className={styles.statTrend}>
              <ArrowDownRight className="h-4 w-4 text-red-500" />
              <span className="text-red-500">2 new today</span>
            </p>
          </div>
          <div className={styles.statIcon}>
            <AlertCircle size={20} className="text-yellow-500" />
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Expiring Leases</p>
            <h3>${tenantData.expiring_leases}</h3>
            <p className={styles.statTrend}>
              <ArrowUpRight className="h-4 w-4" />
              <span>8% from last month</span>
            </p>
          </div>
          <div className={styles.statIcon}>
            <DollarSign size={20} className="text-purple-500" />
          </div>
        </Card>
      </div>
                                                                                                            
      {/* Filters */}                                                                       
      <div className={styles.filters}>
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search tenants..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </Select>
          
          <Select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="all">All Properties</option>
            {properties.map(property => (
              <option key={property} value={property}>
                {property}
              </option>
            ))}
          </Select>
          
          {(statusFilter !== 'all' || propertyFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter('all');
                setPropertyFilter('all');
              }}
              className="flex items-center gap-1"
            >
              <X size={14} />
              <span>Clear filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tenants Table */}
      <div className={styles.tenantTable}>
        {paginatedTenants.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto h-16 w-16 text-gray-300">
              <User className="h-full w-full" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">No tenants found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' || propertyFilter !== 'all' 
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'Get started by adding a new tenant.'}
            </p>
            <div className="mt-6">
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPropertyFilter('all');
                  setShowAddModal(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add Tenant
              </Button>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={paginatedTenants}
            rowKey="id"
            className="w-full"
            headerClassName="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            rowClassName="border-t border-gray-200 hover:bg-gray-50"
            cellClassName="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          />
        )}
      </div>

      {/* Pagination */}
      {filteredTenants.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * itemsPerPage >= filteredTenants.length}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredTenants.length)}
                </span>{' '}
                of <span className="font-medium">{filteredTenants.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.ceil(filteredTenants.length / itemsPerPage) }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={classNames(
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      pageNum === currentPage
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    )}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage * itemsPerPage >= filteredTenants.length}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Tenant Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            unit: '',
            property: '',
            propertyId: '',
            leaseStart: '',
            leaseEnd: '',
            rent: 0,
            status: 'active',
            paymentStatus: 'current',
            emergencyContact: '',
            notes: ''
          });
        }}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{selectedTenant ? 'Edit Tenant' : 'Add New Tenant'}</h2>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    unit: '',
                    property: '',
                    propertyId: '',
                    leaseStart: '',
                    leaseEnd: '',
                    rent: 0,
                    status: 'active',
                    paymentStatus: 'current',
                    emergencyContact: '',
                    notes: ''
                  });
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Personal Information</h3>
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Emergency Contact"
                  name="emergencyContact"
                  value={formData.emergencyContact || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Lease Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Unit Number"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Property"
                    name="property"
                    value={formData.property}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Lease Start Date"
                    type="date"
                    name="leaseStart"
                    value={formData.leaseStart}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Lease End Date"
                    type="date"
                    name="leaseEnd"
                    value={formData.leaseEnd}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Monthly Rent ($)"
                    type="number"
                    name="rent"
                    value={formData.rent || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <Select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                    className="w-full"
                  >
                    <option value="current">Current</option>
                    <option value="late">Late</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <TextArea
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any additional notes about the tenant..."
              />
            </div>

            <div className={styles.formActions}>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    unit: '',
                    property: '',
                    propertyId: '',
                    leaseStart: '',
                    leaseEnd: '',
                    rent: 0,
                    status: 'active',
                    paymentStatus: 'current',
                    emergencyContact: '',
                    notes: ''
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedTenant ? 'Update Tenant' : 'Add Tenant'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="sm"
      >
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Delete {selectedTenant?.name}?
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this tenant? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              className="px-6"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}