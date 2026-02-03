import React, { useState } from 'react';
import { Plus, Edit, Eye, MapPin, Home, Trash2 } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Table } from '../Table';
import { Modal } from '../Modal';
import { Input, Select } from '../Input';
import axios from 'axios';
import { API_URL } from '../../../config';
interface PropertiesPageProps {
  onNavigate: (page: string, propertyId?: string) => void;
}

export function PropertiesPage({ onNavigate }: PropertiesPageProps) {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<typeof properties[0] | null>(null);

  const properties = [
    {
      id: '1',
      name: 'Oakwood Apartments',
      location: '123 Main Street, New York, NY 10001',
      units: 24,
      occupied: 22,
      occupancyRate: 92,
      monthlyRevenue: '$28,800',
      image: 'PROPERTY_IMAGE_1',
    },
    {
      id: '2',
      name: 'Riverside Complex',
      location: '456 River Road, Brooklyn, NY 11201',
      units: 36,
      occupied: 34,
      occupancyRate: 94,
      monthlyRevenue: '$54,000',
      image: 'PROPERTY_IMAGE_2',
    },
    {
      id: '3',
      name: 'Sunset Plaza',
      location: '789 Sunset Blvd, Manhattan, NY 10002',
      units: 18,
      occupied: 15,
      occupancyRate: 83,
      monthlyRevenue: '$27,000',
      image: 'PROPERTY_IMAGE_3',
    },
    {
      id: '4',
      name: 'Green Valley',
      location: '321 Valley Drive, Queens, NY 11373',
      units: 28,
      occupied: 26,
      occupancyRate: 93,
      monthlyRevenue: '$39,200',
      image: 'PROPERTY_IMAGE_1',
    },
  ];

  const handleEdit = (property: typeof properties[0]) => {
    setSelectedProperty(property);
    setShowEditModal(true);
  };

  const handleDelete = (property: typeof properties[0]) => {
    setSelectedProperty(property);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Deleting property:', selectedProperty?.name);
    setShowDeleteModal(false);
    setSelectedProperty(null);
  };
  const [property_name, setPropertyName] = useState('');
  const [street_address, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip_code, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [property_type, setPropertyType] = useState('');
  const [total_units, setTotalUnits] = useState('');
  const [purchase_date, setPurchaseDate] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  // add properties
  /*
  field:
  property_name = models.CharField(max_length=100)
    street_address = models.CharField(max_length=200)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    country = models.CharField(max_length=50)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    total_units = models.IntegerField()
    purchase_date = models.DateField(auto_now_add=True, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='proprietes/', blank=True, null=True)

  */
  const AddProperties = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('property_name', property_name);
    formData.append('street_address', street_address);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('zip_code', zip_code);
    formData.append('country', country);
    formData.append('property_type', property_type);
    formData.append('total_units', total_units);
    formData.append('purchase_date', purchase_date);
    formData.append('description', description);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const response = await axios.post(`${API_URL}/proprietes/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Property added successfully:', response.data);
      setShowAddModal(false);
      // Reset form
      setPropertyName('');
      setStreetAddress('');
      setCity('');
      setState('');
      setZipCode('');
      setCountry('');
      setPropertyType('');
      setTotalUnits('');
      setPurchaseDate('');
      setDescription('');
      setPhoto(null);
    } catch (error) {
      console.error('Error adding property:', error);
    }
  }
  const columns = [
    {
      key: 'name',
      header: 'Property Name',
      render: (property: typeof properties[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-gray-200)] overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)]"></div>
          </div>
          <div>
            <p className="text-[var(--color-gray-900)]">{property.name}</p>
            <p className="text-sm text-[var(--color-gray-500)] flex items-center gap-1">
              <MapPin size={14} />
              {property.location}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'units',
      header: 'Units',
      render: (property: typeof properties[0]) => (
        <div>
          <p className="text-[var(--color-gray-900)]">{property.units} Total</p>
          <p className="text-sm text-[var(--color-gray-500)]">{property.occupied} Occupied</p>
        </div>
      ),
    },
    {
      key: 'occupancyRate',
      header: 'Occupancy',
      render: (property: typeof properties[0]) => (
        <div>
          <p className="text-[var(--color-gray-900)] mb-1">{property.occupancyRate}%</p>
          <div className="w-24 h-2 bg-[var(--color-gray-200)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-success-500)] rounded-full"
              style={{ width: `${property.occupancyRate}%` }}
            ></div>
          </div>
        </div>
      ),
    },
    {
      key: 'monthlyRevenue',
      header: 'Monthly Revenue',
      render: (property: typeof properties[0]) => (
        <p className="text-[var(--color-gray-900)]">{property.monthlyRevenue}</p>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (property: typeof properties[0]) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('property-details', property.id);
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
              handleEdit(property);
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
              handleDelete(property);
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
          <h1>Properties</h1>
          <p className="mt-1 text-[var(--color-gray-600)]">
            Manage your property portfolio
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 bg-[var(--color-gray-100)] rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-1.5 rounded text-sm transition-all ${
                view === 'grid'
                  ? 'bg-white shadow-sm text-[var(--color-gray-900)]'
                  : 'text-[var(--color-gray-600)]'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 rounded text-sm transition-all ${
                view === 'table'
                  ? 'bg-white shadow-sm text-[var(--color-gray-900)]'
                  : 'text-[var(--color-gray-600)]'
              }`}
            >
              Table
            </button>
          </div>
          <Button icon={<Plus size={20} />} onClick={() => setShowAddModal(true)}>
            Add Property
          </Button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card
              key={property.id}
              padding="none"
              hover
              className="cursor-pointer"
            >
              <div className="h-48 bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 right-4">
                  <Badge variant="success">{property.occupancyRate}% Occupied</Badge>
                </div>
              </div>
              <div className="p-6">
                <h4 className="mb-2">{property.name}</h4>
                <p className="text-sm text-[var(--color-gray-600)] flex items-center gap-1 mb-4">
                  <MapPin size={14} />
                  {property.location}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-[var(--color-gray-200)]">
                  <div>
                    <p className="text-sm text-[var(--color-gray-600)] mb-1">Total Units</p>
                    <p className="text-[var(--color-gray-900)]">{property.units}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-gray-600)] mb-1">Monthly Revenue</p>
                    <p className="text-[var(--color-gray-900)]">{property.monthlyRevenue}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    icon={<Eye size={16} />}
                    onClick={() => onNavigate('property-details', property.id)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<Edit size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(property);
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
                      handleDelete(property);
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <Table
            data={properties}
            columns={columns}
            searchable
            searchPlaceholder="Search properties..."
            onRowClick={(property) => onNavigate('property-details', property.id)}
          />
        </Card>
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
            <Button type="submit" onClick={AddProperties}>
              Add Property
            </Button>
          </>
        }
      >
        <form className="space-y-5" onSubmit={AddProperties} encType="multipart/form-data">
          <Input label="Property Name" value={property_name} onChange={(e) => setPropertyName(e.target.value)} placeholder="Enter property name" required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Street Address" value={street_address} onChange={(e) => setStreetAddress(e.target.value)} placeholder="123 Main Street" required />
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="New York" required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="State" value={state} onChange={(e) => setState(e.target.value)} placeholder="NY" required />
            <Input label="ZIP Code" value={zip_code} onChange={(e) => setZipCode(e.target.value)} placeholder="10001" required />
            <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="USA" required />
          </div>
          {/* 
          PROPERTY_TYPE_CHOICES = [
        ('Apartment', 'Apartement'),
        ('Single_Family_Home', 'FamilyHome'),
        ('Commercial', 'commercial'),
    ] */}
          <Select
            label="Property Type"
            value={property_type}
            onChange={(e) => setPropertyType(e.target.value)}
            options={[
              { value: 'Apartment', label: 'Apartement' },
              { value: 'Single_Family_Home', label: 'FamilyHome' },
              { value: 'Commercial', label: 'commercial' },
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input type="number" label="Total Units" value={total_units} onChange={(e) => setTotalUnits(e.target.value)} placeholder="0" required />
            <Input label="Purchase Date" type="date" value={purchase_date} onChange={(e) => setPurchaseDate(e.target.value)} required />
          </div>

          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the property" />
          <Input 
            label="Photo" 
            type="file" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setPhoto(e.target.files[0]);
              }
            }} 
            placeholder="Upload property photo" 
          />
        </form>
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProperty(null);
        }}
        title="Edit Property"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowEditModal(false);
              setSelectedProperty(null);
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log('Updating property:', selectedProperty?.name);
              setShowEditModal(false);
              setSelectedProperty(null);
            }}>
              Save Changes
            </Button>
          </>
        }
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
            <Button variant="danger" onClick={confirmDelete}>
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