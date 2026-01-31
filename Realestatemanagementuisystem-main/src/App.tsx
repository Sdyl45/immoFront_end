import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { ForgotPasswordPage } from './components/pages/ForgotPasswordPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { PropertiesPage } from './components/pages/PropertiesPage';
import { PropertyDetailsPage } from './components/pages/PropertyDetailsPage';
import { UnitsPage } from './components/pages/UnitsPage';
import { TenantsPage } from './components/pages/TenantsPage';
import { LeasesPage } from './components/pages/LeasesPage';
import { CreateLeaseWizard } from './components/pages/CreateLeaseWizard';
import { InvoicesPage } from './components/pages/InvoicesPage';
import { PaymentsPage } from './components/pages/PaymentsPage';
import { SettingsPage } from './components/pages/SettingsPage';

type Page = 
  | 'login' 
  | 'register' 
  | 'forgot-password' 
  | 'dashboard' 
  | 'properties' 
  | 'property-details'
  | 'units' 
  | 'unit-details'
  | 'tenants' 
  | 'tenant-details'
  | 'leases'
  | 'lease-details'
  | 'create-lease'
  | 'invoices'
  | 'invoice-details'
  | 'payments'
  | 'settings';

export type UserRole = 'admin' | 'tenant' | 'maintenance';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [userRole, setUserRole] = useState<UserRole>('admin');

  const handleLogin = (role: UserRole = 'admin') => {
    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('admin');
    setCurrentPage('login');
  };

  const handleNavigate = (page: string, itemId?: string) => {
    // Role-based access control
    const restrictedPages: Record<UserRole, string[]> = {
      admin: [], // Admin has access to all pages
      tenant: ['properties', 'units', 'tenants', 'property-details', 'unit-details', 'tenant-details', 'create-lease'],
      maintenance: ['properties', 'units', 'tenants', 'leases', 'invoices', 'payments', 'property-details', 'unit-details', 'tenant-details', 'lease-details', 'create-lease', 'invoice-details'],
    };

    // Check if the page is restricted for the current user role
    if (restrictedPages[userRole].includes(page)) {
      console.warn(`Access denied: ${userRole} cannot access ${page}`);
      return;
    }

    setCurrentPage(page as Page);
    if (itemId) setSelectedItemId(itemId);
  };

  // Authentication pages
  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return (
        <RegisterPage
          onRegister={handleLogin}
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      );
    }

    if (currentPage === 'forgot-password') {
      return (
        <ForgotPasswordPage
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      );
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToRegister={() => setCurrentPage('register')}
        onNavigateToForgotPassword={() => setCurrentPage('forgot-password')}
      />
    );
  }

  // Lease creation wizard (full screen)
  if (currentPage === 'create-lease') {
    return (
      <CreateLeaseWizard
        onCancel={() => setCurrentPage('leases')}
        onComplete={() => setCurrentPage('leases')}
      />
    );
  }

  // Main application layout
  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <Navbar userRole={userRole} />
      <div className="flex">
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
          userRole={userRole}
        />
        <main className="flex-1 p-8">
          {currentPage === 'dashboard' && (
            <DashboardPage onNavigate={handleNavigate} userRole={userRole} />
          )}
          {currentPage === 'properties' && (
            <PropertiesPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'property-details' && (
            <PropertyDetailsPage
              propertyId={selectedItemId}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'units' && (
            <UnitsPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'tenants' && (
            <TenantsPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'leases' && (
            <LeasesPage
              onNavigate={handleNavigate}
              onCreateLease={() => setCurrentPage('create-lease')}
            />
          )}
          {currentPage === 'invoices' && (
            <InvoicesPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'payments' && (
            <PaymentsPage />
          )}
          {currentPage === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>
    </div>
  );
}