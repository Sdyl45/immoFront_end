import React, { useState } from 'react';
import { ArrowLeft, MapPin, Edit, Plus, Home, AlertCircle, FileText } from 'lucide-react';
import { Card, CardHeader } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Table } from '../Table';

interface PropertyDetailsPageProps {
  propertyId: string;
  onNavigate: (page: string) => void;
}

export function PropertyDetailsPage({ propertyId, onNavigate }: PropertyDetailsPageProps) {
  const property = {
    id: propertyId,
    name: 'Oakwood Apartments',
    location: '123 Main Street, New York, NY 10001',
    type: 'Apartment Complex',
    totalUnits: 24,
    occupied: 22,
    occupancyRate: 92,
    monthlyRevenue: '$28,800',
    purchaseDate: '2022-03-15',
    description: 'Modern apartment complex with premium amenities including fitness center, pool, and parking.',
  };

  const units = [
    { id: 'U101', number: '101', type: '1BR', size: '750 sq ft', rent: '$1,200', tenant: 'Sarah Johnson', status: 'Occupied' },
    { id: 'U102', number: '102', type: '2BR', size: '1,100 sq ft', rent: '$1,800', tenant: 'Michael Chen', status: 'Occupied' },
    { id: 'U103', number: '103', type: '1BR', size: '750 sq ft', rent: '$1,200', tenant: '', status: 'Vacant' },
    { id: 'U201', number: '201', type: '2BR', size: '1,100 sq ft', rent: '$1,800', tenant: 'Emily Rodriguez', status: 'Occupied' },
    { id: 'U202', number: '202', type: '3BR', size: '1,500 sq ft', rent: '$2,400', tenant: 'David Martinez', status: 'Occupied' },
  ];

  const maintenanceIssues = [
    { id: '1', unit: 'Unit 205', issue: 'Leaking faucet in kitchen', priority: 'Medium', status: 'In Progress', reportedDate: '2024-12-07' },
    { id: '2', unit: 'Unit 101', issue: 'HVAC not heating properly', priority: 'High', status: 'Open', reportedDate: '2024-12-06' },
    { id: '3', unit: 'Unit 304', issue: 'Broken window lock', priority: 'Low', status: 'Open', reportedDate: '2024-12-05' },
  ];

  const unitColumns = [
    { key: 'number', header: 'Unit #' },
    { key: 'type', header: 'Type' },
    { key: 'size', header: 'Size' },
    { key: 'rent', header: 'Monthly Rent' },
    {
      key: 'tenant',
      header: 'Tenant',
      render: (unit: typeof units[0]) => unit.tenant || <span className="text-[var(--color-gray-400)]">—</span>,
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={20} />}
          onClick={() => onNavigate('properties')}
        >
          Back
        </Button>
        <div className="flex-1">
          <h1>{property.name}</h1>
          <p className="mt-1 text-[var(--color-gray-600)] flex items-center gap-1">
            <MapPin size={16} />
            {property.location}
          </p>
        </div>
        <Button icon={<Edit size={20} />}>
          Edit Property
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Property Information" />
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-[var(--color-gray-600)] mb-1">Property Type</p>
              <p className="text-[var(--color-gray-900)]">{property.type}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-gray-600)] mb-1">Purchase Date</p>
              <p className="text-[var(--color-gray-900)]">{property.purchaseDate}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-gray-600)] mb-1">Total Units</p>
              <p className="text-[var(--color-gray-900)]">{property.totalUnits}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-gray-600)] mb-1">Monthly Revenue</p>
              <p className="text-[var(--color-gray-900)]">{property.monthlyRevenue}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-[var(--color-gray-600)] mb-1">Description</p>
              <p className="text-[var(--color-gray-900)]">{property.description}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h4 className="mb-4">Occupancy Status</h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--color-gray-600)]">Occupancy Rate</span>
                  <span className="text-[var(--color-gray-900)]">{property.occupancyRate}%</span>
                </div>
                <div className="h-2 bg-[var(--color-gray-200)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-success-500)] rounded-full"
                    style={{ width: `${property.occupancyRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-[var(--color-gray-200)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-success-500)]"></div>
                  <span className="text-sm text-[var(--color-gray-700)]">Occupied</span>
                </div>
                <span className="text-[var(--color-gray-900)]">{property.occupied}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-warning-500)]"></div>
                  <span className="text-sm text-[var(--color-gray-700)]">Vacant</span>
                </div>
                <span className="text-[var(--color-gray-900)]">{property.totalUnits - property.occupied}</span>
              </div>
            </div>
          </Card>

          <Card className="bg-[var(--color-warning-50)] border-[var(--color-warning-200)]">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-[var(--color-warning-600)] flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[var(--color-warning-900)] mb-1">Maintenance Issues</h5>
                <p className="text-sm text-[var(--color-warning-700)]">
                  {maintenanceIssues.length} active maintenance requests
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card padding="none">
        <div className="p-6 border-b border-[var(--color-gray-200)]">
          <div className="flex items-center justify-between">
            <div>
              <h3>Units</h3>
              <p className="text-sm text-[var(--color-gray-600)] mt-1">
                All units in this property
              </p>
            </div>
            <Button icon={<Plus size={20} />} size="sm">
              Add Unit
            </Button>
          </div>
        </div>
        <Table
          data={units}
          columns={unitColumns}
          searchable
          searchPlaceholder="Search units..."
        />
      </Card>

      <Card>
        <CardHeader
          title="Maintenance Issues"
          action={
            <Button variant="secondary" size="sm">
              View All
            </Button>
          }
        />
        <div className="space-y-3">
          {maintenanceIssues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center justify-between p-4 bg-[var(--color-gray-50)] rounded-lg"
            >
              <div className="flex-1">
                <p className="text-[var(--color-gray-900)] mb-1">{issue.issue}</p>
                <p className="text-sm text-[var(--color-gray-600)]">{issue.unit}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={issue.priority === 'High' ? 'danger' : issue.priority === 'Medium' ? 'warning' : 'default'}>
                  {issue.priority}
                </Badge>
                <Badge variant={issue.status === 'In Progress' ? 'info' : 'warning'}>
                  {issue.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
