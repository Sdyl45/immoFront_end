import React, { useState } from 'react';
import { Plus, Eye, Download, Send } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Table } from '../Table';
import { Modal } from '../Modal';
import { Input, Select } from '../Input';

interface InvoicesPageProps {
  onNavigate: (page: string, invoiceId?: string) => void;
}

export function InvoicesPage({ onNavigate }: InvoicesPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const invoices = [
    {
      id: 'INV001',
      invoiceNumber: 'INV-2024-001',
      tenant: 'Sarah Johnson',
      lease: 'LSE-2024-001',
      unit: 'Unit 101',
      property: 'Oakwood Apartments',
      amount: '$1,200',
      dueDate: '2024-12-15',
      issueDate: '2024-12-01',
      status: 'Pending',
    },
    {
      id: 'INV002',
      invoiceNumber: 'INV-2024-002',
      tenant: 'Michael Chen',
      lease: 'LSE-2024-002',
      unit: 'Unit 102',
      property: 'Oakwood Apartments',
      amount: '$1,800',
      dueDate: '2024-12-15',
      issueDate: '2024-12-01',
      status: 'Paid',
    },
    {
      id: 'INV003',
      invoiceNumber: 'INV-2024-003',
      tenant: 'Emily Rodriguez',
      lease: 'LSE-2024-003',
      unit: 'Unit 205',
      property: 'Riverside Complex',
      amount: '$1,500',
      dueDate: '2024-12-10',
      issueDate: '2024-11-25',
      status: 'Overdue',
    },
    {
      id: 'INV004',
      invoiceNumber: 'INV-2024-004',
      tenant: 'David Martinez',
      lease: 'LSE-2023-045',
      unit: 'Unit 302',
      property: 'Sunset Plaza',
      amount: '$1,800',
      dueDate: '2024-12-15',
      issueDate: '2024-12-01',
      status: 'Paid',
    },
  ];

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      render: (invoice: typeof invoices[0]) => (
        <p className="text-[var(--color-gray-900)]">{invoice.invoiceNumber}</p>
      ),
    },
    {
      key: 'tenant',
      header: 'Tenant',
      render: (invoice: typeof invoices[0]) => (
        <div>
          <p className="text-[var(--color-gray-900)]">{invoice.tenant}</p>
          <p className="text-sm text-[var(--color-gray-500)]">{invoice.unit}</p>
        </div>
      ),
    },
    {
      key: 'lease',
      header: 'Lease',
      render: (invoice: typeof invoices[0]) => (
        <p className="text-sm text-[var(--color-gray-900)]">{invoice.lease}</p>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (invoice: typeof invoices[0]) => (
        <p className="text-[var(--color-gray-900)]">{invoice.amount}</p>
      ),
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      render: (invoice: typeof invoices[0]) => (
        <p className="text-sm text-[var(--color-gray-900)]">{invoice.issueDate}</p>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (invoice: typeof invoices[0]) => (
        <p className="text-sm text-[var(--color-gray-900)]">{invoice.dueDate}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (invoice: typeof invoices[0]) => (
        <Badge
          variant={
            invoice.status === 'Paid'
              ? 'success'
              : invoice.status === 'Overdue'
              ? 'danger'
              : 'warning'
          }
        >
          {invoice.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (invoice: typeof invoices[0]) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('invoice-details', invoice.id);
            }}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Download size={16} />}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Invoices</h1>
          <p className="mt-1 text-[var(--color-gray-600)]">
            Manage and track rental invoices
          </p>
        </div>
        <Button icon={<Plus size={20} />} onClick={() => setShowCreateModal(true)}>
          Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Total Invoiced</p>
          <h2 className="mb-2">
            $
            {invoices
              .reduce((sum, inv) => sum + parseInt(inv.amount.replace(/[$,]/g, '')), 0)
              .toLocaleString()}
          </h2>
          <p className="text-sm text-[var(--color-gray-500)]">This month</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Paid</p>
          <h2 className="mb-2">
            $
            {invoices
              .filter((inv) => inv.status === 'Paid')
              .reduce((sum, inv) => sum + parseInt(inv.amount.replace(/[$,]/g, '')), 0)
              .toLocaleString()}
          </h2>
          <Badge variant="success">{invoices.filter((inv) => inv.status === 'Paid').length} invoices</Badge>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Pending</p>
          <h2 className="mb-2">
            $
            {invoices
              .filter((inv) => inv.status === 'Pending')
              .reduce((sum, inv) => sum + parseInt(inv.amount.replace(/[$,]/g, '')), 0)
              .toLocaleString()}
          </h2>
          <Badge variant="warning">{invoices.filter((inv) => inv.status === 'Pending').length} invoices</Badge>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Overdue</p>
          <h2 className="mb-2">
            $
            {invoices
              .filter((inv) => inv.status === 'Overdue')
              .reduce((sum, inv) => sum + parseInt(inv.amount.replace(/[$,]/g, '')), 0)
              .toLocaleString()}
          </h2>
          <Badge variant="danger">{invoices.filter((inv) => inv.status === 'Overdue').length} invoices</Badge>
        </Card>
      </div>

      <Card padding="none">
        <Table
          data={invoices}
          columns={columns}
          searchable
          searchPlaceholder="Search invoices by number, tenant, or property..."
          onRowClick={(invoice) => onNavigate('invoice-details', invoice.id)}
        />
      </Card>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Invoice"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCreateModal(false)} icon={<Send size={16} />}>
              Create & Send
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          <Select
            label="Select Lease"
            options={[
              { value: '', label: 'Select lease...' },
              { value: 'L001', label: 'LSE-2024-001 - Sarah Johnson (Unit 101)' },
              { value: 'L002', label: 'LSE-2024-002 - Michael Chen (Unit 102)' },
              { value: 'L003', label: 'LSE-2024-003 - Emily Rodriguez (Unit 205)' },
            ]}
            required
          />

          <Input label="Invoice Date" type="date" required />
          <Input label="Due Date" type="date" required />

          <Input
            type="number"
            label="Amount ($)"
            placeholder="1200"
            helperText="Monthly rent amount"
            required
          />

          <Select
            label="Invoice Type"
            options={[
              { value: 'rent', label: 'Monthly Rent' },
              { value: 'deposit', label: 'Security Deposit' },
              { value: 'late', label: 'Late Fee' },
              { value: 'maintenance', label: 'Maintenance Charge' },
              { value: 'other', label: 'Other' },
            ]}
            required
          />

          <Input label="Description" placeholder="December 2024 rent payment" />

          <Input label="Notes" placeholder="Any additional notes for the tenant" />
        </form>
      </Modal>
    </div>
  );
}
