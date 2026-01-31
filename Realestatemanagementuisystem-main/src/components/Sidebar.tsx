import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Settings,
  LogOut,
  Wrench,
} from 'lucide-react';
import { UserRole } from '../App';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userRole: UserRole;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'tenant', 'maintenance'] },
  { id: 'properties', label: 'Properties', icon: <Building2 size={20} />, roles: ['admin'] },
  { id: 'units', label: 'Units', icon: <Home size={20} />, roles: ['admin'] },
  { id: 'tenants', label: 'Tenants', icon: <Users size={20} />, roles: ['admin'] },
  { id: 'leases', label: 'My Lease', icon: <FileText size={20} />, roles: ['tenant'] },
  { id: 'leases', label: 'Leases', icon: <FileText size={20} />, roles: ['admin'] },
  { id: 'invoices', label: 'My Invoices', icon: <Receipt size={20} />, roles: ['tenant'] },
  { id: 'invoices', label: 'Invoices', icon: <Receipt size={20} />, roles: ['admin'] },
  { id: 'payments', label: 'My Payments', icon: <CreditCard size={20} />, roles: ['tenant'] },
  { id: 'payments', label: 'Payments', icon: <CreditCard size={20} />, roles: ['admin'] },
];

export function Sidebar({ currentPage, onNavigate, onLogout, userRole }: SidebarProps) {
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white border-r border-[var(--color-gray-200)] h-[calc(100vh-73px)] sticky top-[73px] flex flex-col">
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {filteredMenuItems.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPage === item.id
                  ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
                  : 'text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-[var(--color-gray-200)] mt-6 pt-6 px-3">
          <button
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === 'settings'
                ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
                : 'text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)]'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <div className="border-t border-[var(--color-gray-200)] p-3">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-danger-600)] hover:bg-[var(--color-danger-50)] transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}