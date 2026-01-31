import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import { Button } from './Button';
import { UserRole } from '../App';

interface NavbarProps {
  userName?: string;
  userRole?: UserRole;
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Property Manager',
  tenant: 'Tenant',
  maintenance: 'Maintenance Staff',
};

export function Navbar({ userName = 'John Doe', userRole = 'admin' }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-[var(--color-gray-200)] px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-600)] flex items-center justify-center">
              <span className="text-white">IP</span>
            </div>
            <h2 className="text-[var(--color-primary-700)]">ImmoPoem</h2>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 bg-[var(--color-gray-100)] rounded-lg px-4 py-2 w-96">
            <Search size={18} className="text-[var(--color-gray-500)]" />
            <input
              type="text"
              placeholder="Search properties, tenants, leases..."
              className="bg-transparent outline-none flex-1 text-[var(--color-gray-700)] placeholder:text-[var(--color-gray-500)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-[var(--color-gray-100)] transition-colors">
            <Bell size={20} className="text-[var(--color-gray-600)]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-danger-500)] rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-gray-200)]">
            <div className="text-right hidden md:block">
              <p className="text-sm text-[var(--color-gray-900)]">{userName}</p>
              <p className="text-xs text-[var(--color-gray-500)]">{roleLabels[userRole]}</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center hover:bg-[var(--color-primary-200)] transition-colors">
              <User size={20} className="text-[var(--color-primary-700)]" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}