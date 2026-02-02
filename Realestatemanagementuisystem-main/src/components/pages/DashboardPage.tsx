import React, { useState, useEffect } from 'react';
import { Building2, Home, Users, FileText, Receipt, TrendingUp, Plus, ArrowRight, Wrench, AlertCircle } from 'lucide-react';
import { Card, CardHeader } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Dropdown } from '../Dropdown';
import { UserRole } from '../../App';
import axios from 'axios';
import { API_URL } from '../../../config';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  userRole: UserRole;
}

export function DashboardPage({ onNavigate, userRole }: DashboardPageProps) {

  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [leases, setLeases] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchProperties();
    fetchUnits();
    fetchTenants();
    fetchLeases();
    fetchInvoices();
    fetchPayments();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/proprietes/total/`);
      setProperties(response.data['total_proprietes']);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await axios.get(`${API_URL}/proprietes/total-units`);
      setUnits(response.data);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await axios.get(`${API_URL}/tenantsDashboard`);
      setTenants(response.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const fetchLeases = async () => {
    try {
      const response = await axios.get(`${API_URL}/leasesDashboard`);
      setLeases(response.data);
    } catch (error) {
      console.error('Error fetching leases:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${API_URL}/invoices/total`);
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/paiements/Detail`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };


  // Admin Dashboard
  if (userRole === 'admin') {
    const metrics = [
      {
        label: 'Total Properties',
        value: properties,
        change: '+12%',
        trend: 'up',
        icon: <Building2 size={24} />,
        color: 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]',
      },
      {
        label: 'Total Units',
        value: '156',
        change: '+8%',
        trend: 'up',
        icon: <Home size={24} />,
        color: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]',
      },
      {
        label: 'Occupancy Rate',
        value: '92%',
        change: '+5%',
        trend: 'up',
        icon: <TrendingUp size={24} />,
        color: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]',
      },
      {
        label: 'Active Leases',
        value: '143',
        change: '+3%',
        trend: 'up',
        icon: <FileText size={24} />,
        color: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]',
      },
    ];

    const quickActions = [
      { label: 'Add Property', icon: <Building2 size={20} />, onClick: () => onNavigate('properties') },
      { label: 'Add Unit', icon: <Home size={20} />, onClick: () => onNavigate('units') },
      { label: 'Add Tenant', icon: <Users size={20} />, onClick: () => onNavigate('tenants') },
    ];

    const recentPayments = [
      { tenant: 'Sarah Johnson', unit: 'Unit 101 - Oakwood Apartments', amount: '$1,200', date: '2024-12-08', status: 'Paid' },
      { tenant: 'Michael Chen', unit: 'Unit 205 - Riverside Complex', amount: '$1,500', date: '2024-12-08', status: 'Paid' },
      { tenant: 'Emily Rodriguez', unit: 'Unit 302 - Sunset Plaza', amount: '$1,800', date: '2024-12-07', status: 'Paid' },
      { tenant: 'David Martinez', unit: 'Unit 104 - Green Valley', amount: '$1,350', date: '2024-12-07', status: 'Paid' },
    ];

    const pendingInvoices = [
      { tenant: 'Jessica Brown', unit: 'Unit 203 - Oakwood Apartments', amount: '$1,200', dueDate: '2024-12-15', daysUntilDue: 6 },
      { tenant: 'Robert Taylor', unit: 'Unit 401 - Riverside Complex', amount: '$1,600', dueDate: '2024-12-12', daysUntilDue: 3 },
      { tenant: 'Lisa Anderson', unit: 'Unit 105 - Sunset Plaza', amount: '$1,400', dueDate: '2024-12-10', daysUntilDue: 1 },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>Dashboard</h1>
            <p className="mt-1 text-[var(--color-gray-600)]">
              Welcome back! Here&apos;s what&apos;s happening with your properties.
            </p>
          </div>
          <Dropdown
            trigger={
              <Button icon={<Plus size={20} />}>
                Quick Actions
              </Button>
            }
            items={quickActions}
            align="right"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} padding="md" hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--color-gray-600)] mb-1">{metric.label}</p>
                  <h2 className="mb-2">{metric.value}</h2>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-success-600)]">
                    <TrendingUp size={16} />
                    <span>{metric.change}</span>
                    <span className="text-[var(--color-gray-500)]">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Pending Invoices"
              subtitle={`${pendingInvoices.length} invoices awaiting payment`}
              action={
                <Button variant="ghost" size="sm" onClick={() => onNavigate('invoices')}>
                  View All
                  <ArrowRight size={16} />
                </Button>
              }
            />
            <div className="space-y-4">
              {pendingInvoices.map((invoice, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[var(--color-gray-50)] rounded-lg hover:bg-[var(--color-gray-100)] transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="text-[var(--color-gray-900)] mb-1">{invoice.tenant}</p>
                    <p className="text-sm text-[var(--color-gray-600)]">{invoice.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--color-gray-900)] mb-1">{invoice.amount}</p>
                    <Badge variant={invoice.daysUntilDue <= 3 ? 'warning' : 'info'}>
                      Due in {invoice.daysUntilDue}d
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Recent Payments"
              subtitle="Latest payment activity"
              action={
                <Button variant="ghost" size="sm" onClick={() => onNavigate('payments')}>
                  View All
                  <ArrowRight size={16} />
                </Button>
              }
            />
            <div className="space-y-4">
              {recentPayments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[var(--color-gray-50)] rounded-lg hover:bg-[var(--color-gray-100)] transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="text-[var(--color-gray-900)] mb-1">{payment.tenant}</p>
                    <p className="text-sm text-[var(--color-gray-600)]">{payment.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--color-gray-900)] mb-1">{payment.amount}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">{payment.status}</Badge>
                      <span className="text-xs text-[var(--color-gray-500)]">{payment.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Tenant Dashboard
  if (userRole === 'tenant') {
    const tenantInfo = {
      name: 'Sarah Johnson',
      unit: 'Unit 101',
      property: 'Oakwood Apartments',
      leaseEnd: '2025-06-30',
      rent: '$1,200',
    };

    const upcomingPayments = [
      { description: 'December Rent', amount: '$1,200', dueDate: '2024-12-15', daysUntilDue: 6, status: 'Pending' },
    ];

    const recentPayments = [
      { description: 'November Rent', amount: '$1,200', date: '2024-11-08', status: 'Paid' },
      { description: 'October Rent', amount: '$1,200', date: '2024-10-08', status: 'Paid' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1>My Dashboard</h1>
          <p className="mt-1 text-[var(--color-gray-600)]">
            Welcome back, {tenantInfo.name}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <p className="text-sm text-[var(--color-gray-600)] mb-1">My Unit</p>
            <h3 className="mb-1">{tenantInfo.unit}</h3>
            <p className="text-sm text-[var(--color-gray-600)]">{tenantInfo.property}</p>
          </Card>
          <Card>
            <p className="text-sm text-[var(--color-gray-600)] mb-1">Monthly Rent</p>
            <h2 className="mb-1">{tenantInfo.rent}</h2>
            <Badge variant="success">Current</Badge>
          </Card>
          <Card>
            <p className="text-sm text-[var(--color-gray-600)] mb-1">Lease Ends</p>
            <h3 className="mb-1">{tenantInfo.leaseEnd}</h3>
            <p className="text-sm text-[var(--color-gray-500)]">6 months remaining</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Upcoming Payments"
              subtitle="Payments due soon"
            />
            <div className="space-y-4">
              {upcomingPayments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[var(--color-gray-50)] rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-[var(--color-gray-900)] mb-1">{payment.description}</p>
                    <p className="text-sm text-[var(--color-gray-600)]">Due: {payment.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--color-gray-900)] mb-1">{payment.amount}</p>
                    <Button size="sm" onClick={() => onNavigate('payments')}>Pay Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Payment History"
              subtitle="Recent payments"
            />
            <div className="space-y-4">
              {recentPayments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[var(--color-gray-50)] rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-[var(--color-gray-900)] mb-1">{payment.description}</p>
                    <p className="text-sm text-[var(--color-gray-600)]">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--color-gray-900)] mb-1">{payment.amount}</p>
                    <Badge variant="success">{payment.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="My Lease Information"
            subtitle="View your lease details"
            action={
              <Button variant="secondary" size="sm" onClick={() => onNavigate('leases')}>
                View Lease
                <ArrowRight size={16} />
              </Button>
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[var(--color-gray-50)] rounded-lg">
            <div>
              <p className="text-sm text-[var(--color-gray-600)] mb-1">Lease Start</p>
              <p className="text-[var(--color-gray-900)]">2024-07-01</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-gray-600)] mb-1">Lease End</p>
              <p className="text-[var(--color-gray-900)]">{tenantInfo.leaseEnd}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-gray-600)] mb-1">Monthly Rent</p>
              <p className="text-[var(--color-gray-900)]">{tenantInfo.rent}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-gray-600)] mb-1">Security Deposit</p>
              <p className="text-[var(--color-gray-900)]">$2,400</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Maintenance Dashboard
  if (userRole === 'maintenance') {
    const stats = [
      { label: 'Open Requests', value: '8', color: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]', icon: <AlertCircle size={24} /> },
      { label: 'In Progress', value: '5', color: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]', icon: <Wrench size={24} /> },
      { label: 'Completed Today', value: '3', color: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]', icon: <FileText size={24} /> },
    ];

    const workOrders = [
      { id: 'WO-001', property: 'Oakwood Apartments', unit: 'Unit 101', issue: 'Leaking faucet in kitchen', priority: 'High', status: 'Open' },
      { id: 'WO-002', property: 'Riverside Complex', unit: 'Unit 205', issue: 'AC not cooling properly', priority: 'High', status: 'In Progress' },
      { id: 'WO-003', property: 'Sunset Plaza', unit: 'Unit 302', issue: 'Light fixture replacement', priority: 'Medium', status: 'Open' },
      { id: 'WO-004', property: 'Green Valley', unit: 'Unit 104', issue: 'Cabinet door repair', priority: 'Low', status: 'Open' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1>Maintenance Dashboard</h1>
          <p className="mt-1 text-[var(--color-gray-600)]">
            Manage work orders and maintenance requests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} padding="md" hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--color-gray-600)] mb-1">{stat.label}</p>
                  <h2>{stat.value}</h2>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader
            title="Active Work Orders"
            subtitle="Requests requiring attention"
          />
          <div className="space-y-3">
            {workOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-[var(--color-gray-50)] rounded-lg hover:bg-[var(--color-gray-100)] transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-[var(--color-gray-900)]">{order.id}</p>
                    <Badge variant={order.priority === 'High' ? 'danger' : order.priority === 'Medium' ? 'warning' : 'default'}>
                      {order.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--color-gray-900)] mb-1">{order.issue}</p>
                  <p className="text-sm text-[var(--color-gray-600)]">{order.unit} - {order.property}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={order.status === 'In Progress' ? 'info' : 'warning'}>{order.status}</Badge>
                  <Button size="sm" variant="secondary">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return null;
}