import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, User, Building2, Home, FileText } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input, Select } from '../Input';
import { Badge } from '../Badge';

interface CreateLeaseWizardProps {
  onCancel: () => void;
  onComplete: () => void;
}

export function CreateLeaseWizard({ onCancel, onComplete }: CreateLeaseWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');

  const steps = [
    { number: 1, title: 'Select Tenant', icon: <User size={20} /> },
    { number: 2, title: 'Select Property', icon: <Building2 size={20} /> },
    { number: 3, title: 'Select Unit', icon: <Home size={20} /> },
    { number: 4, title: 'Lease Terms', icon: <FileText size={20} /> },
    { number: 5, title: 'Review & Confirm', icon: <Check size={20} /> },
  ];

  const tenants = [
    { id: 'T001', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(555) 123-4567' },
    { id: 'T002', name: 'Michael Chen', email: 'mchen@email.com', phone: '(555) 234-5678' },
    { id: 'T003', name: 'Emily Rodriguez', email: 'emily.r@email.com', phone: '(555) 345-6789' },
  ];

  const properties = [
    { id: 'P001', name: 'Oakwood Apartments', location: '123 Main St, New York', availableUnits: 2 },
    { id: 'P002', name: 'Riverside Complex', location: '456 River Rd, Brooklyn', availableUnits: 3 },
    { id: 'P003', name: 'Sunset Plaza', location: '789 Sunset Blvd, Manhattan', availableUnits: 1 },
  ];

  const units = [
    { id: 'U101', number: '101', type: '1 Bedroom', size: '750 sq ft', rent: '$1,200' },
    { id: 'U103', number: '103', type: '1 Bedroom', size: '750 sq ft', rent: '$1,200' },
    { id: 'U205', number: '205', type: '2 Bedroom', size: '1,100 sq ft', rent: '$1,800' },
  ];

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
    else onComplete();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else onCancel();
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Create New Lease</h1>
          <p className="text-[var(--color-gray-600)]">
            Follow the steps to create a new lease agreement
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.number
                        ? 'bg-[var(--color-success-500)] text-white'
                        : currentStep === step.number
                        ? 'bg-[var(--color-primary-600)] text-white'
                        : 'bg-[var(--color-gray-200)] text-[var(--color-gray-500)]'
                    }`}
                  >
                    {currentStep > step.number ? <Check size={20} /> : step.icon}
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      currentStep >= step.number
                        ? 'text-[var(--color-gray-900)]'
                        : 'text-[var(--color-gray-500)]'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-all ${
                      currentStep > step.number
                        ? 'bg-[var(--color-success-500)]'
                        : 'bg-[var(--color-gray-200)]'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card padding="lg">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">Select Tenant</h3>
                <p className="text-[var(--color-gray-600)]">
                  Choose the tenant for this lease agreement
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {tenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant.id)}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTenant === tenant.id
                        ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                        : 'border-[var(--color-gray-200)] hover:border-[var(--color-gray-300)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4>{tenant.name}</h4>
                        <p className="text-[var(--color-gray-600)] mt-1">{tenant.email}</p>
                        <p className="text-sm text-[var(--color-gray-500)] mt-1">{tenant.phone}</p>
                      </div>
                      {selectedTenant === tenant.id && (
                        <Check size={24} className="text-[var(--color-primary-600)]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">Select Property</h3>
                <p className="text-[var(--color-gray-600)]">
                  Choose the property for this lease
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    onClick={() => setSelectedProperty(property.id)}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedProperty === property.id
                        ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                        : 'border-[var(--color-gray-200)] hover:border-[var(--color-gray-300)]'
                    }`}
                  >
                    <h4 className="mb-2">{property.name}</h4>
                    <p className="text-sm text-[var(--color-gray-600)] mb-3">{property.location}</p>
                    <Badge variant="info">{property.availableUnits} units available</Badge>
                    {selectedProperty === property.id && (
                      <Check size={20} className="text-[var(--color-primary-600)] mt-3" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">Select Unit</h3>
                <p className="text-[var(--color-gray-600)]">
                  Choose an available unit in the selected property
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnit(unit.id)}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedUnit === unit.id
                        ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                        : 'border-[var(--color-gray-200)] hover:border-[var(--color-gray-300)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4>Unit {unit.number}</h4>
                      {selectedUnit === unit.id && (
                        <Check size={20} className="text-[var(--color-primary-600)]" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-[var(--color-gray-600)]">Type</p>
                        <p className="text-[var(--color-gray-900)]">{unit.type}</p>
                      </div>
                      <div>
                        <p className="text-[var(--color-gray-600)]">Size</p>
                        <p className="text-[var(--color-gray-900)]">{unit.size}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[var(--color-gray-600)]">Monthly Rent</p>
                        <p className="text-[var(--color-gray-900)]">{unit.rent}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">Lease Terms</h3>
                <p className="text-[var(--color-gray-600)]">
                  Define the terms and conditions of the lease
                </p>
              </div>
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Lease Start Date" type="date" required />
                  <Input label="Lease End Date" type="date" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Monthly Rent ($)" type="number" placeholder="1200" required />
                  <Input label="Security Deposit ($)" type="number" placeholder="2400" required />
                </div>

                <Select
                  label="Payment Frequency"
                  options={[
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'quarterly', label: 'Quarterly' },
                    { value: 'annually', label: 'Annually' },
                  ]}
                  required
                />

                <Input label="Payment Due Date" type="number" placeholder="1" helperText="Day of the month (1-31)" required />

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Late Fee ($)" type="number" placeholder="50" />
                  <Input label="Grace Period (days)" type="number" placeholder="5" />
                </div>

                <Input label="Special Terms" placeholder="Any additional terms or conditions" />
              </form>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">Review & Confirm</h3>
                <p className="text-[var(--color-gray-600)]">
                  Review all details before creating the lease
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[var(--color-gray-50)] rounded-lg">
                  <h5 className="mb-3 text-[var(--color-gray-700)]">Tenant Information</h5>
                  <p className="text-[var(--color-gray-900)]">Sarah Johnson</p>
                  <p className="text-sm text-[var(--color-gray-600)]">sarah.j@email.com</p>
                </div>

                <div className="p-4 bg-[var(--color-gray-50)] rounded-lg">
                  <h5 className="mb-3 text-[var(--color-gray-700)]">Property & Unit</h5>
                  <p className="text-[var(--color-gray-900)]">Unit 101 - Oakwood Apartments</p>
                  <p className="text-sm text-[var(--color-gray-600)]">1 Bedroom, 750 sq ft</p>
                </div>

                <div className="p-4 bg-[var(--color-gray-50)] rounded-lg">
                  <h5 className="mb-3 text-[var(--color-gray-700)]">Lease Terms</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[var(--color-gray-600)]">Monthly Rent</p>
                      <p className="text-[var(--color-gray-900)]">$1,200</p>
                    </div>
                    <div>
                      <p className="text-[var(--color-gray-600)]">Security Deposit</p>
                      <p className="text-[var(--color-gray-900)]">$2,400</p>
                    </div>
                    <div>
                      <p className="text-[var(--color-gray-600)]">Start Date</p>
                      <p className="text-[var(--color-gray-900)]">2025-01-01</p>
                    </div>
                    <div>
                      <p className="text-[var(--color-gray-600)]">End Date</p>
                      <p className="text-[var(--color-gray-900)]">2025-12-31</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-gray-200)]">
            <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft size={20} />}>
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onCancel}>
                Save as Draft
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedTenant) ||
                  (currentStep === 2 && !selectedProperty) ||
                  (currentStep === 3 && !selectedUnit)
                }
              >
                {currentStep === 5 ? 'Create Lease' : 'Next'}
                {currentStep < 5 && <ArrowRight size={20} />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
