import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Input } from '../Input';
import { Button } from '../Button';

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

export function ForgotPasswordPage({ onNavigateToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-600)] mb-4">
            <span className="text-white text-2xl">IP</span>
          </div>
          <h1 className="mb-2">Reset Your Password</h1>
          <p className="text-[var(--color-gray-600)]">
            {submitted
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive a reset link'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="We'll send you a link to reset your password"
                required
              />

              <Button type="submit" className="w-full" size="lg">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[var(--color-success-50)] flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-[var(--color-success-600)]" />
              </div>
              <h3 className="mb-2">Check Your Email</h3>
              <p className="text-[var(--color-gray-600)] mb-6">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <Button onClick={() => setSubmitted(false)} variant="secondary" className="w-full">
                Resend Email
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={onNavigateToLogin}
              className="inline-flex items-center gap-2 text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
            >
              <ArrowLeft size={16} />
              Back to login
            </button>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-[var(--color-gray-600)]">
          © 2024 ImmoPoem. All rights reserved.
        </p>
      </div>
    </div>
  );
}
