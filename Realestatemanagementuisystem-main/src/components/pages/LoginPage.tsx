import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '../Input';
import { Button } from '../Button';
import { UserRole } from '../../App';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export function LoginPage({ onLogin, onNavigateToRegister, onNavigateToForgotPassword }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mock user database for demonstration
  const mockUsers: Record<string, { password: string; role: UserRole }> = {
    'admin@immopoem.com': { password: 'admin123', role: 'admin' },
    'manager@immopoem.com': { password: 'manager123', role: 'admin' },
    'tenant@immopoem.com': { password: 'tenant123', role: 'tenant' },
    'sarah.j@email.com': { password: 'tenant123', role: 'tenant' },
    'maintenance@immopoem.com': { password: 'maintenance123', role: 'maintenance' },
    'john.m@immopoem.com': { password: 'maintenance123', role: 'maintenance' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = mockUsers[email.toLowerCase()];
    
    if (!user) {
      setError('Invalid email or password');
      return;
    }

    if (user.password !== password) {
      setError('Invalid email or password');
      return;
    }

    // Login successful - pass the role to parent
    onLogin(user.role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-600)] mb-4">
            <span className="text-white text-2xl">IP</span>
          </div>
          <h1 className="mb-2">Welcome to ImmoPoem</h1>
          <p className="text-[var(--color-gray-600)]">Sign in to manage your properties</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-[var(--color-danger-50)] border border-[var(--color-danger-200)] rounded-lg">
                <p className="text-sm text-[var(--color-danger-700)]">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[var(--color-gray-300)]" />
                <span className="text-sm text-[var(--color-gray-700)]">Remember me</span>
              </label>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-gray-600)]">
              Don&apos;t have an account?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-[var(--color-gray-50)] rounded-lg border border-[var(--color-gray-200)]">
            <p className="text-xs text-[var(--color-gray-600)] mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-[var(--color-gray-600)]">
              <p><strong>Admin:</strong> admin@immopoem.com / admin123</p>
              <p><strong>Tenant:</strong> tenant@immopoem.com / tenant123</p>
              <p><strong>Maintenance:</strong> maintenance@immopoem.com / maintenance123</p>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-[var(--color-gray-600)]">
          © 2025 ImmoPoem. All rights reserved.
        </p>
      </div>
    </div>
  );
}