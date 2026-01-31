import React, { useState } from 'react';
import { Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react';
import { Input } from '../Input';
import { Button } from '../Button';

interface RegisterPageProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export function RegisterPage({ onRegister, onNavigateToLogin }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-600)] mb-4">
            <span className="text-white text-2xl">IP</span>
          </div>
          <h1 className="mb-2">Create Your Account</h1>
          <p className="text-[var(--color-gray-600)]">Start managing your properties today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                icon={<User size={18} />}
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                required
              />
            </div>

            <Input
              label="Company Name"
              placeholder="Your Company"
              icon={<Building2 size={18} />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={<Mail size={18} />}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock size={18} />}
                helperText="Must be at least 8 characters"
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

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock size={18} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[42px] text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded border-[var(--color-gray-300)]" required />
              <span className="text-sm text-[var(--color-gray-700)]">
                I agree to the{' '}
                <a href="#" className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
                  Privacy Policy
                </a>
              </span>
            </label>

            <Button type="submit" className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-gray-600)]">
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-[var(--color-gray-600)]">
          © 2024 ImmoPoem. All rights reserved.
        </p>
      </div>
    </div>
  );
}
