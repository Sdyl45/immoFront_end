import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Home, 
  Users, 
  FileText, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  AlertCircle,
  Clock,
  DollarSign,
  Calendar,
  ChevronRight,
  Search,
  Wrench
} from 'lucide-react';
import { UserRole } from '../../App';
import axios from 'axios';
import { API_URL } from '../../../config';
import styles from './DashboardPage.module.scss';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  userRole: UserRole;
}

export function DashboardPage({ onNavigate, userRole }: DashboardPageProps) {

  const [properties, setProperties] = useState(0);
  const [units, setUnits] = useState(0);
  const [tenants, setTenants] = useState(0);
  const [bails, setBails] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);

  useEffect(() => {
    fetchProperties();
    fetchUnits();
    fetchTenants();
    fetchbails();
    fetchOccupancyRate();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/proprietes/total/`,{
        headers: {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setProperties(response.data['total_proprietes']);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await axios.get(`${API_URL}/unites/Dashboard`);
      setUnits(response.data['total_units']);
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

  const fetchbails = async () => {
    try {
      const response = await axios.get(`${API_URL}/BailDashboard/`);
      setBails(response.data['total_bails']);
    } catch (error) {
      console.error('Error fetching bails:', error);
    }
  };

  const fetchOccupancyRate = async () => {
    try {
      const response = await axios.get(`${API_URL}/OccupancyRate`);
      setOccupancyRate(response.data['occupancy_rate']);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };


  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if date parsing fails
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
        icon: <Building2 size={20} />,
        color: 'bg-blue-100 text-blue-600',
      },
      {
        label: 'Total Units',
        value: units,
        change: '+8%',
        trend: 'up',
        icon: <Home size={20} />,
        color: 'bg-green-100 text-green-600',
      },
      {
        label: 'Occupancy Rate',
        value: `${occupancyRate}%`,
        change: '+5%',
        trend: 'up',
        icon: <TrendingUp size={20} />,
        color: 'bg-cyan-100 text-cyan-600',
      },
      {
        label: 'Active Leases',
        value: bails,
        change: '+3%',
        trend: 'up',
        icon: <FileText size={20} />,
        color: 'bg-amber-100 text-amber-600',
      },
    ];

    const quickActions = [
      { label: 'Add Property', icon: <Building2 size={16} />, onClick: () => onNavigate('properties') },
      { label: 'Add Unit', icon: <Home size={16} />, onClick: () => onNavigate('units') },
      { label: 'Add Tenant', icon: <Users size={16} />, onClick: () => onNavigate('tenants') },
      { label: 'Create Lease', icon: <FileText size={16} />, onClick: () => onNavigate('create-lease') },
    ];

    const recentPayments = [
      { id: 1, tenant: 'Sarah Johnson', unit: 'Unit 101 - Oakwood Apartments', amount: '$1,200', date: '2024-12-08', status: 'Paid' },
      { id: 2, tenant: 'Michael Chen', unit: 'Unit 205 - Riverside Complex', amount: '$1,500', date: '2024-12-08', status: 'Paid' },
      { id: 3, tenant: 'Emily Rodriguez', unit: 'Unit 302 - Sunset Plaza', amount: '$1,800', date: '2024-12-07', status: 'Paid' },
    ];

    const pendingInvoices = [
      { id: 1, tenant: 'Jessica Brown', unit: 'Unit 203 - Oakwood Apartments', amount: '$1,200', dueDate: '2024-12-15', daysUntilDue: 6 },
      { id: 2, tenant: 'Robert Taylor', unit: 'Unit 401 - Riverside Complex', amount: '$1,600', dueDate: '2024-12-12', daysUntilDue: 3 },
      { id: 3, tenant: 'Lisa Anderson', unit: 'Unit 105 - Sunset Plaza', amount: '$1,400', dueDate: '2024-12-10', daysUntilDue: 1 },
    ];

    return (
      <div className={styles.dashboardContainer}>
        <header className={styles.header}>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your properties.</p>
        </header>

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <div key={index} className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <div className={`${styles.metricIcon} ${metric.color}`}>
                  {metric.icon}
                </div>
                <span className={`${styles.trendBadge} ${metric.trend}`}>
                  {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
                </span>
              </div>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={styles.metricLabel}>{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <button 
                key={index} 
                className={styles.actionButton}
                onClick={action.onClick}
              >
                <div className={styles.actionIcon}>
                  {action.icon}
                </div>
                <span className={styles.actionText}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.dashboardContent}>
          {/* Recent Payments */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Recent Payments</h2>
              <a href="#" className={styles.viewAll}>
                View all <ChevronRight size={16} />
              </a>
            </div>
            <div className={styles.sectionContent}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Unit</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.tenant}</td>
                      <td>{payment.unit}</td>
                      <td>{payment.amount}</td>
                      <td>{formatDate(payment.date)}</td>
                      <td>
                        <span className={`${styles.statusBadge} paid`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Invoices */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Pending Invoices</h2>
              <a href="#" className={styles.viewAll}>
                View all <ChevronRight size={16} />
              </a>
            </div>
            <div className={styles.sectionContent}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Unit</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.tenant}</td>
                      <td>{invoice.unit}</td>
                      <td>{invoice.amount}</td>
                      <td>{formatDate(invoice.dueDate)}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${
                          invoice.daysUntilDue <= 3 ? 'overdue' : 'pending'
                        }`}>
                          {invoice.daysUntilDue <= 3 ? 'Due Soon' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
            <div key={index} className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--color-gray-600)] mb-1">{stat.label}</p>
                  <h2 className="text-2xl font-bold">{stat.value}</h2>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Active Work Orders</h2>
                <p className="text-sm text-[var(--color-gray-600)]">Requests requiring attention</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Create New
              </button>
            </div>
            <div className="space-y-3">
              {workOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-[var(--color-gray-50)] rounded-lg hover:bg-[var(--color-gray-100)] transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-[var(--color-gray-900)]">{order.id}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.priority === 'High' 
                          ? 'bg-red-100 text-red-800' 
                          : order.priority === 'Medium' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {order.priority}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-gray-900)] mb-1">{order.issue}</p>
                    <p className="text-sm text-[var(--color-gray-600)]">{order.unit} - {order.property}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'In Progress' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                    <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default return if no role matches
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Property Management</h1>
          <p className="text-lg text-gray-600">Please sign in to access your dashboard.</p>
        </div>
      </div>
    </div>
  );
}