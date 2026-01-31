import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Table } from '../Table';
import { Modal } from '../Modal';
import { Input, Select } from '../Input';

export function PaymentsPage() {
  const [showRecordModal, setShowRecordModal] = useState(false);

  const payments = [
    {
      id: 'PAY001',
      paymentId: 'PAY-2024-001',
      tenant: 'Sarah Johnson',
      invoice: 'INV-2024-001',
      unit: 'Unit 101',
      property: 'Oakwood Apartments',
      amount: '$1,200',
      date: '2024-12-08',
      method: 'Bank Transfer',
      status: 'Completed',
    },
    {
      id: 'PAY002',
      paymentId: 'PAY-2024-002',
      tenant: 'Michael Chen',
      invoice: 'INV-2024-002',
      unit: 'Unit 102',
      property: 'Oakwood Apartments',
      amount: '$1,800',
      date: '2024-12-08',
      method: 'Credit Card',
      status: 'Completed',
    },
    {
      id: 'PAY003',
      paymentId: 'PAY-2024-003',
      tenant: 'Emily Rodriguez',
      invoice: 'INV-2024-003',
      unit: 'Unit 205',
      property: 'Riverside Complex',
      amount: '$1,500',
      date: '2024-12-07',
      method: 'Check',
      status: 'Processing',
    },
    {
      id: 'PAY004',
      paymentId: 'PAY-2024-004',
      tenant: 'David Martinez',
      invoice: 'INV-2024-004',
      unit: 'Unit 302',
      property: 'Sunset Plaza',
      amount: '$1,800',
      date: '2024-12-07',
      method: 'Bank Transfer',
      status: 'Completed',
    },
  ];

  const columns = [
    {
      key: 'paymentId',
      header: 'Payment ID',
      render: (payment: typeof payments[0]) => (
        <p className="text-[var(--color-gray-900)]">{payment.paymentId}</p>
      ),
    },
    {
      key: 'tenant',
      header: 'Tenant',
      render: (payment: typeof payments[0]) => (
        <div>
          <p className="text-[var(--color-gray-900)]">{payment.tenant}</p>
          <p className="text-sm text-[var(--color-gray-500)]">{payment.unit}</p>
        </div>
      ),
    },
    {
      key: 'invoice',
      header: 'Invoice',
      render: (payment: typeof payments[0]) => (
        <p className="text-sm text-[var(--color-gray-900)]">{payment.invoice}</p>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (payment: typeof payments[0]) => (
        <p className="text-[var(--color-gray-900)]">{payment.amount}</p>
      ),
    },
    {
      key: 'date',
      header: 'Payment Date',
      render: (payment: typeof payments[0]) => (
        <p className="text-sm text-[var(--color-gray-900)]">{payment.date}</p>
      ),
    },
    {
      key: 'method',
      header: 'Method',
      render: (payment: typeof payments[0]) => (
        <p className="text-sm text-[var(--color-gray-900)]">{payment.method}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (payment: typeof payments[0]) => (
        <Badge variant={payment.status === 'Completed' ? 'success' : 'warning'}>
          {payment.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <Button
          variant="ghost"
          size="sm"
          icon={<Download size={16} />}
          onClick={(e) => e.stopPropagation()}
        >
          Receipt
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Payments</h1>
          <p className="mt-1 text-[var(--color-gray-600)]">
            Track and manage rent payments
          </p>
        </div>
        <Button icon={<Plus size={20} />} onClick={() => setShowRecordModal(true)}>
          Record Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Total Received</p>
          <h2 className="mb-2">
            $
            {payments
              .filter((p) => p.status === 'Completed')
              .reduce((sum, p) => sum + parseInt(p.amount.replace(/[$,]/g, '')), 0)
              .toLocaleString()}
          </h2>
          <p className="text-sm text-[var(--color-gray-500)]">This month</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Completed</p>
          <h2 className="mb-2">{payments.filter((p) => p.status === 'Completed').length}</h2>
          <Badge variant="success">Payments</Badge>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Processing</p>
          <h2 className="mb-2">{payments.filter((p) => p.status === 'Processing').length}</h2>
          <Badge variant="warning">Payments</Badge>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-gray-600)] mb-1">Collection Rate</p>
          <h2 className="mb-2">
            {Math.round((payments.filter((p) => p.status === 'Completed').length / payments.length) * 100)}%
          </h2>
          <p className="text-sm text-[var(--color-gray-500)]">Success rate</p>
        </Card>
      </div>

      <Card padding="none">
        <Table
          data={payments}
          columns={columns}
          searchable
          searchPlaceholder="Search payments by ID, tenant, or invoice..."
        />
      </Card>

      <Modal
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        title="Record New Payment"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowRecordModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowRecordModal(false)}>Record Payment</Button>
          </>
        }
      >
        <form className="space-y-5">
          <Select
            label="Select Invoice"
            options={[
              { value: '', label: 'Select invoice...' },
              { value: 'INV001', label: 'INV-2024-001 - Sarah Johnson - $1,200' },
              { value: 'INV002', label: 'INV-2024-002 - Michael Chen - $1,800' },
              { value: 'INV003', label: 'INV-2024-003 - Emily Rodriguez - $1,500' },
            ]}
            required
          />

          <Input label="Payment Date" type="date" required />

          <Input type="number" label="Amount Paid ($)" placeholder="1200" required />

          <Select
            label="Payment Method"
            options={[
              { value: '', label: 'Select method...' },
              { value: 'bank', label: 'Bank Transfer' },
              { value: 'card', label: 'Credit Card' },
              { value: 'check', label: 'Check' },
              { value: 'cash', label: 'Cash' },
            ]}
            required
          />

          <Input label="Transaction Reference" placeholder="TXN123456" />

          <Input label="Notes" placeholder="Any additional notes about this payment" />
        </form>
      </Modal>
    </div>
  );
}
