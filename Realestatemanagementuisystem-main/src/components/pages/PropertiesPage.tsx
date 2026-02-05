import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit, 
  Eye, 
  MapPin, 
  Home, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
  XCircle,
  DollarSign,
  X,
  SlidersHorizontal,
  Calendar,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Table } from '../Table';
import { Modal } from '../Modal';
import { Input, Select, TextArea } from '../Input';
import { Pagination } from '../Pagination';
import axios from 'axios';
import { API_URL } from '../../../config';
import { formatCurrency } from '../../../utils/formatters';
import styles from './PropertiesPage.module.scss';

type PropertyStatus = 'active' | 'maintenance' | 'vacant';

interface Property {
  id: string;
  name: string;
  location: string;
  type: string;
  status: PropertyStatus;
  units: number;
  occupied: number;
  monthlyRevenue: string;
  image?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  yearBuilt?: number;
  amenities?: string[];
  features?: string[];
  occupancyRate: number;
  lastUpdated: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  nextInspection?: string;
  notes?: string;
}

interface PropertiesPageProps {
  onNavigate: (page: string, id?: string) => void;
  onLogout: () => void;
}

export function PropertiesPage({ onNavigate, onLogout }: PropertiesPageProps) {
  // View state
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Form state
  const [formData, setFormData] = useState<Partial<Property>>({
    name: '',
    type: 'apartment',
    status: 'active',
    location: '',
    units: 0,
    occupied: 0,
    monthlyRevenue: '0',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    yearBuilt: new Date().getFullYear(),
    amenities: [],
    features: [],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    notes: ''
  });

  const fetchPropertiesList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/proprietes/list`, {
        headers: {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      // Mapper les données de l'API vers le format attendu par le frontend
      const formattedProperties = response.data.map((property: any) => ({
        id: property.id.toString(),
        property_name: property.property_name || 'Sans nom',
        street_address: property.street_address || '',
        city: property.city || '',
        state: property.state || 'active',
        zip_code: property.zip_code || '',
        country: property.country || '',
        property_type: property.property_type || 'other',
        total_units: property.total_units || 0,
        occupied: property.occupied_units || 0,
        monthlyRevenue: property.monthly_revenue ? `$${property.monthly_revenue}` : '$0',
        description: property.description || '',
        photo: property.photo || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        // Calculer le taux d'occupation
        occupancyRate: property.total_units > 0 
          ? Math.round(((property.occupied_units || 0) / property.total_units) * 100) 
          : 0
      }));

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Erreur lors de la récupération des propriétés:', error);
      // En cas d'erreur, on peut définir un état vide ou gérer l'erreur différemment
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch properties from API
  useEffect(() => {
    fetchPropertiesList();
  }, []);

  // Format currency helper
  const formatCurrencyValue = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue);
  };

  // Filter properties based on search query and filters
  const filteredProperties = useCallback(() => {
    return properties.filter(property => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        (property.property_name?.toLowerCase().includes(query) ||
        property.street_address?.toLowerCase().includes(query) ||
        property.city?.toLowerCase().includes(query) ||
        property.description?.toLowerCase().includes(query)) ?? false;

      const matchesStatus = statusFilter === 'all' || property.state === statusFilter;
      const matchesType = typeFilter === 'all' || property.property_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [properties, searchQuery, statusFilter, typeFilter]);

  // Pagination
  const totalItems = filteredProperties().length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentProperties = filteredProperties().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (selectedProperty) {
        // Update existing property
        setProperties(prev =>
          prev.map(p =>
            p.id === selectedProperty.id
              ? { ...formData, id: selectedProperty.id } as Property
              : p
          )
        );
      } else {
        // Add new property
        const newProperty: Property = {
          ...formData as Omit<Property, 'id' | 'occupancyRate' | 'lastUpdated'>,
          id: Math.random().toString(36).substr(2, 9),
          occupancyRate: Math.round(((formData.occupied || 0) / (formData.units || 1)) * 100),
          lastUpdated: new Date().toISOString()
        };

        setProperties(prev => [...prev, newProperty]);
      }

      // Reset form and close modal
      setShowAddModal(false);
      setFormData({
        name: '',
        type: 'apartment',
        status: 'active',
        location: '',
        units: 0,
        occupied: 0,
        monthlyRevenue: '0',
        description: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        yearBuilt: new Date().getFullYear(),
        amenities: [],
        features: [],
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        notes: ''
      });
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete property
  const handleDelete = async () => {
    if (!selectedProperty) return;

    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setProperties(prev => prev.filter(p => p.id !== selectedProperty.id));
      setShowDeleteModal(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error deleting property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit property
  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setFormData({
      name: property.name,
      type: property.type,
      status: property.status,
      location: property.location,
      units: property.units,
      occupied: property.occupied,
      monthlyRevenue: property.monthlyRevenue,
      description: property.description || '',
      address: property.address || '',
      city: property.city || '',
      state: property.state || '',
      zipCode: property.zipCode || '',
      country: property.country || '',
      yearBuilt: property.yearBuilt || new Date().getFullYear(),
      amenities: property.amenities || [],
      features: property.features || [],
      contactName: property.contactName || '',
      contactEmail: property.contactEmail || '',
      contactPhone: property.contactPhone || '',
      notes: property.notes || ''
    });
    setShowAddModal(true);
  };

  // Calculate statistics
  const calculateStats = useCallback(() => {
    const totalProperties = properties.length;
    const totalOccupied = properties.reduce((sum, prop) => sum + prop.occupied, 0);
    const totalVacant = properties.reduce((sum, prop) => sum + (prop.units - prop.occupied), 0);
    const totalRevenue = properties.reduce(
      (sum, prop) => sum + parseFloat(prop.monthlyRevenue.replace(/[^0-9.-]+/g, '') || '0'),
      0
    );
    const occupancyRate = totalProperties > 0
      ? Math.round((properties.reduce((sum, prop) => sum + prop.occupancyRate, 0) / totalProperties) * 10) / 10
      : 0;

    return {
      totalProperties,
      totalOccupied,
      totalVacant,
      totalRevenue,
      occupancyRate
    };
  }, [properties]);

  const stats = calculateStats();

  // Get status color class
  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'vacant':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get occupancy color class
  const getOccupancyColor = (rate: number) => {
    if (rate >= 75) return 'bg-green-500';
    if (rate >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get time ago
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;

    return 'just now';
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
        label: 'Actif'
      },
      maintenance: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className="h-3.5 w-3.5 mr-1" />,
        label: 'Maintenance'
      },
      vacant: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
        label: 'Libre'
      }
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Helper function to get occupancy color (unified implementation)

  // Property types for filter
  const propertyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
    { value: 'other', label: 'Other' }
  ];

  // Table columns
  const columns = [
    {
      key: 'name',
      header: 'Property',
      render: (property: Property) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-200 mr-3">
            {property.image ? (
              <img 
                src={property.image} 
                alt={property.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{property.name}</div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (property: Property) => (
        <span className="capitalize">{property.type}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (property: Property) => (
        <StatusBadge status={property.status} />
      ),
    },
    {
      key: 'occupancy',
      header: 'Occupancy',
      render: (property: Property) => (
        <div>
          <div className="text-sm text-gray-900">{property.occupied} / {property.units} units</div>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-full ${getOccupancyColor(property.occupancyRate)}`}
              style={{ width: `${property.occupancyRate}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{property.occupancyRate}% occupied</div>
        </div>
      ),
    },
    {
      key: 'revenue',
      header: 'Monthly Revenue',
      render: (property: Property) => (
        <div className="text-sm font-medium text-gray-900">
          {formatCurrencyValue(property.monthlyRevenue)}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (property: Property) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('property-details', property.id);
            }}
            className="text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(property);
            }}
            className="text-gray-500 hover:text-green-600 p-1.5 rounded-full hover:bg-green-50"
            title="Edit property"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProperty(property);
              setShowDeleteModal(true);
            }}
            className="text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50"
            title="Delete property"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.propertiesPage}>
      {/* Header with title and actions */}
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1>Properties</h1>
            <p>Manage your property portfolio and view detailed analytics</p>
          </div>

          <div className={styles.actions}>
            {/* Search bar */}
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View toggle */}
            <div className={styles.viewToggle}>
              <button
                onClick={() => setView('grid')}
                className={`${styles.viewButton} ${view === 'grid' ? styles.active : ''}`}
                aria-label="Grid view"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Grid</span>
              </button>
              <button
                onClick={() => setView('table')}
                className={`${styles.viewButton} ${view === 'table' ? styles.active : ''}`}
                aria-label="Table view"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Table</span>
              </button>
            </div>

            {/* Add Property Button */}
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => setShowAddModal(true)}
              className={styles.addButton}
            >
              Add Property
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>
            <Building2 size={20} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Properties</p>
            <p className={styles.statValue}>{properties.length}</p>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Occupied Units</p>
            <p className={styles.statValue}>
              {properties.reduce((sum, prop) => sum + prop.occupied, 0)}
            </p>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconYellow}`}>
            <XCircle size={20} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Vacant Units</p>
            <p className={styles.statValue}>
              {properties.reduce((sum, prop) => sum + (prop.units - prop.occupied), 0)}
            </p>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
            <DollarSign size={20} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Monthly Revenue</p>
            <p className={styles.statValue}>
              ${properties
                .reduce((sum, prop) => sum + parseInt(prop.monthlyRevenue.replace(/[^0-9]/g, '')), 0)
                .toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className={styles.propertiesGrid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className={`${styles.propertyCard} ${styles.loadingCard}`}>
              <div className={styles.propertyImage}></div>
              <div className={styles.propertyContent}>
                <div className={styles.propertyHeader}>
                  <div className={styles.loadingLine} style={{ width: '70%' }}></div>
                  <div className={styles.loadingLine} style={{ width: '20%' }}></div>
                </div>
                <div className={styles.propertyLocation}>
                  <div className={styles.loadingLine} style={{ width: '90%' }}></div>
                </div>
                <div className={styles.propertyStats}>
                  <div className={styles.stat}>
                    <div className={styles.loadingLine} style={{ width: '60%' }}></div>
                    <div className={styles.loadingLine} style={{ width: '40%' }}></div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.loadingLine} style={{ width: '60%' }}></div>
                    <div className={styles.loadingLine} style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div className={styles.loadingButton}></div>
              </div>
            </div>
          ))}
        </div>
      ) : view === 'grid' ? (
        <div className={styles.propertiesGrid}>
          {properties.map((property) => (
            <article key={property.id} className={styles.propertyCard}>
              <div className={styles.propertyImageContainer}>
                <div
                  className={styles.propertyImage}
                  style={{
                    backgroundImage: `url(${property?.photo || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className={styles.propertyImageOverlay}></div>

                  {/* Status Badge */}
                  <div className={styles.propertyStatus}>
                    <StatusBadge status={property?.state} />
                  </div>

                  {/* Quick Actions */}
                  <div className={styles.propertyActions}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(property);
                      }}
                      className={styles.actionButton}
                      aria-label="Edit property"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(property);
                      }}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      aria-label="Delete property"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {/* Occupancy Badge */}
                  <div className={styles.occupancyBadge}>
                    <span>{property?.occupancyRate}% Occupied</span>
                  </div>
                </div>
              </div>
              
              {/* Property Details */}
              <div className={styles.propertyContent}>
                <div className={styles.propertyHeader}>
                  <h3 className={styles.propertyTitle}>
                    {property?.property_name}
                  </h3>
                  <span className={styles.propertyUnits}>{property?.total_units} units</span>
                </div>
                
                <div className={styles.propertyLocation}>
                  <MapPin size={14} />
                  <span>{property?.street_address}</span>
                </div>
                
                <div className={styles.propertyStats}>
                  <div className={styles.stat}>
                    <p className={styles.statLabel}>Occupied</p>
                    <p className={styles.statValue}>
                      <span className={styles.statHighlight}>{property?.occupied}</span>
                      <span className={styles.statSecondary}> / {property?.total_units}</span>
                    </p>
                  </div>
                  <div className={styles.stat}>
                    <p className={styles.statLabel}>Revenue</p>
                    <p className={styles.statValue}>
                      {property?.monthlyRevenue}
                      <span className={styles.statSecondary}>/mo</span>
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={styles.viewButton}
                  onClick={() => onNavigate('property-details', property.id)}
                >
                  View Details
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900">All Properties</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {filteredProperties.length} properties
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Filter size={14} className="mr-2" />
                Filter
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Download size={14} className="mr-2" />
                Export
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupancy
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProperties.map((property) => (
                  <tr 
                    key={property.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onNavigate('property-details', property.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                          <Building2 size={18} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{property.name}</div>
                          <div className="text-sm text-gray-500">{property.location.split(',')[0]}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={property.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.occupied} / {property.units}</div>
                      <div className="text-xs text-gray-500">{Math.round((property.occupied / property.units) * 100)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              property.occupancyRate > 90 ? 'bg-green-500' : 
                              property.occupancyRate > 70 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`} 
                            style={{ width: `${property.occupancyRate}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{property.occupancyRate}% occupied</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.monthlyRevenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('property-details', property.id);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(property);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit property"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(property);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete property"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredProperties.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredProperties.length}</span> results
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
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Property"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Add Property
            </Button>
          </>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input 
            label="Property Name" 
            name="name"
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="Enter property name" 
            required 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Street Address" 
              name="address"
              value={formData.address} 
              onChange={handleInputChange} 
              placeholder="123 Main Street" 
              required 
            />
            <Input 
              label="City" 
              name="city"
              value={formData.city} 
              onChange={handleInputChange} 
              placeholder="New York" 
              required 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input 
              label="State" 
              name="state"
              value={formData.state} 
              onChange={handleInputChange} 
              placeholder="NY" 
              required 
            />
            <Input 
              label="ZIP Code" 
              name="zipCode"
              value={formData.zipCode} 
              onChange={handleInputChange} 
              placeholder="10001" 
              required 
            />
            <Input 
              label="Country" 
              name="country"
              value={formData.country} 
              onChange={handleInputChange} 
              placeholder="USA" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type <span className="text-red-500">*</span>
              </label>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                options={[
                  { value: 'apartment', label: 'Apartment' },
                  { value: 'house', label: 'House' },
                  { value: 'commercial', label: 'Commercial' },
                  { value: 'other', label: 'Other' },
                ]}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'maintenance', label: 'Maintenance' },
                  { value: 'vacant', label: 'Vacant' },
                ]}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input 
              type="number" 
              label="Total Units" 
              name="units"
              min="1"
              value={formData.units} 
              onChange={handleInputChange} 
              placeholder="0" 
              required 
            />
            <Input 
              type="number" 
              label="Occupied Units" 
              name="occupied"
              min="0"
              max={formData.units}
              value={formData.occupied} 
              onChange={handleInputChange} 
              placeholder="0" 
              required 
            />
            <Input 
              type="text"
              label="Monthly Revenue" 
              name="monthlyRevenue"
              value={formData.monthlyRevenue} 
              onChange={handleInputChange} 
              placeholder="0" 
              required 
              leftIcon={<DollarSign className="h-4 w-4 text-gray-400" />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <TextArea
              name="description"
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="Brief description of the property" 
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features (comma separated)
            </label>
            <Input 
              name="features"
              value={formData.features?.join(', ')} 
              onChange={(e) => 
                handleInputChange({ 
                  target: { 
                    name: 'features', 
                    value: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                  } 
                } as React.ChangeEvent<HTMLInputElement>)
              } 
              placeholder="e.g. Pool, Gym, Parking" 
            />
          </div>
          
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Property'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedProperty(null);
        }}
        title={selectedProperty ? 'Modifier la propriété' : 'Ajouter une propriété'}
        size="lg"
      >
        <form className="space-y-5">
          <Input 
            label="Property Name" 
            placeholder="Enter property name" 
            defaultValue={selectedProperty?.name}
            required 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Street Address" placeholder="123 Main Street" required />
            <Input label="City" placeholder="New York" required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="State" placeholder="NY" required />
            <Input label="ZIP Code" placeholder="10001" required />
            <Input label="Country" placeholder="USA" required />
          </div>

          <Select
            label="Property Type"
            options={[
              { value: '', label: 'Select type...' },
              { value: 'apartment', label: 'Apartment Complex' },
              { value: 'house', label: 'Single Family Home' },
              { value: 'commercial', label: 'Commercial Building' },
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="number" 
              label="Total Units" 
              placeholder="0" 
              defaultValue={selectedProperty?.units.toString()}
              required 
            />
            <Input label="Purchase Date" type="date" required />
          </div>

          <Input label="Description" placeholder="Brief description of the property" />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProperty(null);
        }}
        title="Delete Property"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowDeleteModal(false);
              setSelectedProperty(null);
            }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Property
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
            Are you sure you want to delete <strong>{selectedProperty?.name}</strong>? This will remove all associated units, leases, and data.
          </p>
        </div>
      </Modal>
    </div>
  );
}