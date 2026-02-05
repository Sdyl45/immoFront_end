import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Search, 
  Filter, 
  Home, 
  Calendar, 
  User, 
  DollarSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  XCircle,
  type LucideIcon,
  Building2
} from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Modal } from '../Modal';
import { Input, Select, TextArea } from '../Input';
import { Table } from '../Table';
import styles from './UnitsPage.module.scss';
import axios from 'axios';
import { API_URL } from '../../../config';
// Types
type UnitStatus = 'occupied' | 'vacant' | 'maintenance' | 'reserved';
type UnitType = 'studio' | '1-bedroom' | '2-bedroom' | '3-bedroom' | 'penthouse' | 'commercial';

interface Unit {
  id: string;
  unitNumber: string;
  propertyId: string;
  propertyName: string;
  type: UnitType;
  size: number; // in sq ft
  rent: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  status: UnitStatus;
  tenantName?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  leaseStart?: string;
  leaseEnd?: string;
  amenities: string[];
  description?: string;
  lastUpdated: string;
  images?: string[];
}

interface UnitsPageProps {
  onNavigate: (page: string, unitId?: string) => void;
  onLogout: () => void;
}

export function UnitsPage({ onNavigate, onLogout }: UnitsPageProps) {
  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // State for dashboard data and units
  const [dashboardData, setDashboardData] = useState({
    total_units: 0,
    occupied_units: 0,
    vacant_units: 0,
    total_revenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [units, setUnits] = useState<Unit[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Unit>>({
    unitNumber: '',
    propertyId: '',
    type: '1-bedroom',
    size: 0,
    rent: 0,
    deposit: 0,
    bedrooms: 1,
    bathrooms: 1,
    floor: 1,
    status: 'vacant',
    amenities: [],
  });
  const fetchUnits = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/unites/Dashboard`);
      
      setDashboardData({
        total_units: response.data['total_units'] || 0,
        occupied_units: response.data['occupied_units'] || 0,
        vacant_units: response.data['vacant_units'] || 0,
        total_revenue: response.data['total_revenue'] || 0
      });
      console.log('dashhhhhhhhhhhhhhhhhh')
      console.log(dashboardData)
      
      
    } catch (error) {
      console.error('Error fetching units:', error);
      // En cas d'erreur, définir des valeurs par défaut
      setDashboardData({
        total_units: 0,
        occupied_units: 0,
        vacant_units: 0,
        total_revenue: 0
      });
      setUnits([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement des données initiales
  useEffect(() => {
    fetchUnits();
  }, []);
  
 

  const handleEdit = (unit: Unit) => {
    setFormData({
      unitNumber: unit.unitNumber,
      propertyId: unit.propertyId,
      propertyName: unit.propertyName,
      type: unit.type,
      size: unit.size,
      rent: unit.rent,
      deposit: unit.deposit || 0,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      floor: unit.floor,
      status: unit.status,
      amenities: unit.amenities || [],
      description: unit.description,
      lastUpdated: unit.lastUpdated,
      images: unit.images || [],
      tenantName: unit.tenantName,
      tenantEmail: unit.tenantEmail,
      tenantPhone: unit.tenantPhone,
      leaseStart: unit.leaseStart,
      leaseEnd: unit.leaseEnd
    });
    setSelectedUnit(unit);
    setShowEditModal(true);
  };

  const handleDelete = (unit: Unit) => {
    setSelectedUnit(unit);
    setShowDeleteModal(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'size' || name === 'rent' || name === 'deposit' || name === 'bedrooms' || name === 'bathrooms' || name === 'floor' 
        ? Number(value) 
        : value
    }));
  };

  const confirmDelete = async () => {
    if (!selectedUnit) return;
    
    try {
      console.log('Deleting unit:', selectedUnit.unitNumber);
      // Simuler une suppression asynchrone
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mettre à jour l'état local
      setUnits(prev => prev.filter(unit => unit.id !== selectedUnit.id));
      
      // Afficher un message de succès
      // Vous pourriez utiliser un système de notification ici
      console.log(`Unit ${selectedUnit.unitNumber} deleted successfully`);
      
    } catch (error) {
      console.error('Error deleting unit:', error);
      // Gérer l'erreur (afficher un message à l'utilisateur)
    } finally {
      setShowDeleteModal(false);
      setSelectedUnit(null);
    }
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Créer un nouvel objet unité avec les données du formulaire
      const newUnit: Unit = {
        id: `U${Math.floor(100 + Math.random() * 900)}`, // Générer un ID temporaire
        unitNumber: formData.unitNumber || '',
        propertyId: formData.propertyId || '',
        propertyName: formData.propertyName || '',
        type: formData.type as UnitType,
        size: formData.size || 0,
        rent: formData.rent || 0,
        deposit: formData.deposit || 0,
        bedrooms: formData.bedrooms || 0,
        bathrooms: formData.bathrooms || 1,
        floor: formData.floor || 1,
        status: formData.status as UnitStatus || 'vacant',
        amenities: formData.amenities || [],
        description: formData.description,
        lastUpdated: new Date().toISOString(),
        images: formData.images || [],
        // Copier les champs optionnels si présents
        ...(formData.tenantName && { tenantName: formData.tenantName }),
        ...(formData.tenantEmail && { tenantEmail: formData.tenantEmail }),
        ...(formData.tenantPhone && { tenantPhone: formData.tenantPhone }),
        ...(formData.leaseStart && { leaseStart: formData.leaseStart }),
        ...(formData.leaseEnd && { leaseEnd: formData.leaseEnd }),
      };
      console.log('dashhhhhhhhhhhhhhhhhh')
      console.log(dashboardData)
      
      if (selectedUnit) {
        // Mise à jour d'une unité existante
        setUnits(prev => prev.map(u => u.id === selectedUnit.id ? newUnit : u));
      } else {
        // Ajout d'une nouvelle unité
        setUnits(prev => [...prev, newUnit]);
      }
      
      // Fermer la modale et réinitialiser le formulaire
      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({
        unitNumber: '',
        propertyId: '',
        propertyName: '',
        type: '1-bedroom',
        size: 0,
        rent: 0,
        deposit: 0,
        bedrooms: 1,
        bathrooms: 1,
        floor: 1,
        status: 'vacant',
        amenities: [],
        lastUpdated: new Date().toISOString(),
      });
      setSelectedUnit(null);
      
    } catch (error) {
      console.error('Error saving unit:', error);
    }
  };

  // Filtrer et paginer les unités
  const filteredAndPaginatedUnits = useMemo(() => {
    if (isLoading) {
      return [];
    }

    // Créer une copie des unités pour éviter les mutations directes
    const unitsToFilter = [...units];

    // Appliquer les filtres
    const filtered = unitsToFilter
      .filter(unit => {
        // Filtre par recherche
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            unit.unitNumber.toLowerCase().includes(query) ||
            unit.propertyName.toLowerCase().includes(query) ||
            (unit.tenantName?.toLowerCase().includes(query) ?? false) ||
            unit.type.includes(query)
          );
        }
        return true;
      })
      .filter(unit => statusFilter === 'all' || unit.status === statusFilter)
      .filter(unit => typeFilter === 'all' || unit.type === typeFilter)
      .filter(unit => propertyFilter === 'all' || unit.propertyId === propertyFilter);

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [units, isLoading, searchQuery, statusFilter, typeFilter, propertyFilter, currentPage, itemsPerPage]);

  const columns = [
    {
      key: 'unitNumber',
      header: 'Unit #',
      render: (unit: any) => (
        <div>
          <p className="text-[var(--color-gray-900)]">Unit {unit.unitNumber}</p>
          <p className="text-sm text-[var(--color-gray-500)] capitalize">{unit.type}</p>
        </div>
      ),
    },
    {
      key: 'property',
      header: 'Property',
      render: (unit: any) => (
        <div className="flex items-center gap-2">
          <Home size={16} className="text-[var(--color-gray-400)]" />
          <span className="text-[var(--color-gray-900)]">{unit.propertyName}</span>
        </div>
      ),
    },
    {
      key: 'size',
      header: 'Size',
      render: (unit: any) => (
        <span className="text-[var(--color-gray-900)]">
          {typeof unit.size === 'number' && isFinite(unit.size) 
            ? unit.size.toLocaleString() 
            : '0'} sq ft
        </span>
      ),
    },
    {
      key: 'rent',
      header: 'Monthly Rent',
      render: (unit: any) => (
        <span className="text-[var(--color-gray-900)]">
          ${typeof unit.rent === 'number' && isFinite(unit.rent) 
            ? unit.rent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
            : '0.00'}
        </span>
      ),
    },
    {
      key: 'tenant',
      header: 'Current Tenant',
      render: (unit: any) => (
        <div>
          {unit.tenantName ? (
            <>
              <p className="text-[var(--color-gray-900)]">{unit.tenantName}</p>
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
      render: (unit: any) => (
        <Badge 
          variant={
            unit.status === 'occupied' ? 'success' : 
            unit.status === 'vacant' ? 'outline' :
            unit.status === 'maintenance' ? 'warning' : 'default'
          }
        >
          {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (unit: any) => (
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

  // Rendu conditionnel pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* En-tête de page */}
      <header className={styles.pageHeader}>
        <div>
          <h1>Units</h1>
          <p>Manage all units across your properties</p>
        </div>
        <Button 
          variant="primary"
          size="lg"
          onClick={() => {
            setFormData({
              unitNumber: '',
              propertyId: '',
              propertyName: '',
              type: '1-bedroom',
              size: 0,
              rent: 0,
              deposit: 0,
              bedrooms: 1,
              bathrooms: 1,
              floor: 1,
              status: 'vacant',
              amenities: [],
              lastUpdated: new Date().toISOString(),
            });
            setSelectedUnit(null);
            setShowAddModal(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </header>

      {/* Cartes de statistiques */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Units</p>
            <h3 className={styles.statValue}>
              {isLoading ? '...' : dashboardData.total_units.toLocaleString()}
            </h3>
            <p className={styles.statDescription}>Across all properties</p>
          </div>
          <div className={`${styles.statIcon} ${styles.blueIcon}`}>
            <Home size={20} />
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Occupied</p>
            <h3 className={styles.statValue}>
              {isLoading ? '...' : dashboardData.occupied_units.toLocaleString()}
            </h3>
            <div className={styles.statBadge}>
              <Badge variant="success">
                {isLoading ? '...' : 
                  dashboardData.total_units > 0 
                    ? `${Math.round((dashboardData.occupied_units / dashboardData.total_units) * 100)}% Occupancy`
                    : '0% Occupancy'}
              </Badge>
            </div>
          </div>
          <div className={`${styles.statIcon} ${styles.greenIcon}`}>
            <User size={20} />
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Vacant</p>
            <h3 className={styles.statValue}>
              {isLoading ? '...' : dashboardData.vacant_units.toLocaleString()}
            </h3>
            <div className={styles.statBadge}>
              <Badge variant="outline">Available</Badge>
            </div>
          </div>
          <div className={`${styles.statIcon} ${styles.orangeIcon}`}>
            <Home size={20} />
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Revenue</p>
            <h3 className={styles.statValue}>
              {isLoading ? '...' : `$${dashboardData.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h3>
            <p className={styles.statDescription}>Monthly Revenue</p>
          </div>
          <div className={`${styles.statIcon} ${styles.purpleIcon}`}>
            <DollarSign size={20} />
          </div>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <div className={styles.filtersBar}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Search units by number, property, or tenant..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select 
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="occupied">Occupied</option>
            <option value="vacant">Vacant</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Type:</label>
          <select 
            className={styles.filterSelect}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="studio">Studio</option>
            <option value="1-bedroom">1 Bedroom</option>
            <option value="2-bedroom">2 Bedroom</option>
            <option value="3-bedroom">3+ Bedroom</option>
          </select>
        </div>
      </div>

      {/* Tableau des unités */}
      <Card className={styles.tableCard}>
        <Table
          data={filteredAndPaginatedUnits}
          columns={columns}
          onRowClick={(unit) => onNavigate('unit-details', unit.id)}
          className={styles.unitsTable}
        />
        
        {/* Pagination */}
        {filteredAndPaginatedUnits.length > 0 && (
          <div className={styles.pagination}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className={styles.pageInfo}>
              Page {currentPage} of {Math.ceil(units.length / itemsPerPage)}
            </span>
            
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * itemsPerPage >= units.length}
              className={`${styles.pageButton} ${currentPage * itemsPerPage >= units.length ? styles.disabled : ''}`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
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
              if (selectedUnit) {
                const updatedUnit: Unit = {
                  ...selectedUnit,
                  ...formData,
                  id: selectedUnit.id,
                  lastUpdated: new Date().toISOString()
                };
                setUnits(prev => 
                  prev.map(u => u.id === selectedUnit.id ? updatedUnit : u)
                );
                console.log('Updated unit:', updatedUnit.unitNumber);
              }
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
            defaultValue={selectedUnit?.propertyId || ''}
            onChange={(e) => {
              const property = e.target.value;
              const propertyName = e.target.options[e.target.selectedIndex]?.text || '';
              setFormData(prev => ({
                ...prev,
                propertyId: property,
                propertyName: propertyName
              }));
            }}
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
              name="unitNumber"
              value={formData.unitNumber || ''}
              onChange={handleInputChange}
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
              name="size"
              value={formData.size || ''}
              onChange={handleInputChange}
              required 
            />
            <Input 
              type="number" 
              label="Monthly Rent ($)" 
              placeholder="1200" 
              name="rent"
              value={formData.rent || ''}
              onChange={handleInputChange}
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
            Are you sure you want to delete <strong>Unit {selectedUnit?.unitNumber}</strong>? This will remove any leases and tenant data associated with this unit.
          </p>
        </div>
      </Modal>
    </div>
  );
}