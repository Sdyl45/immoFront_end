import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '../../components/Input';
import { Button } from '../../components/Button';
import { UserRole } from '../../App';
import styles from './LoginPage.module.scss';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export function LoginPage({ onLogin, onNavigateToRegister, onNavigateToForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Mock user database for demonstration
  const mockUsers: Record<string, { password: string; role: UserRole }> = {
    'admin@immopoem.com': { password: 'admin123', role: 'admin' },
    'manager@immopoem.com': { password: 'manager123', role: 'admin' },
    'tenant@immopoem.com': { password: 'tenant123', role: 'tenant' },
    'sarah.j@email.com': { password: 'tenant123', role: 'tenant' },
    'maintenance@immopoem.com': { password: 'maintenance123', role: 'maintenance' },
    'john.m@immopoem.com': { password: 'maintenance123', role: 'maintenance' },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email');
      emailRef.current?.focus();
      return;
    }

    if (!password) {
      setError('Please enter your password');
      passwordRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data - replace with actual authentication
      const user = mockUsers[email.toLowerCase()];

      if (user && user.password === password) {
        // Save to localStorage if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Login successful - pass the role to parent
        onLogin(user.role);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span>IP</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Please sign in to access your account</p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Input
              ref={emailRef}
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={
                <Mail
                  size={18}
                  className="text-gray-400"
                  aria-hidden="true"
                />
              }
              autoComplete="username"
              required
              containerClass="mb-4"
              inputClass={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={
                <Lock
                  size={18}
                  className="text-gray-400"
                  aria-hidden="true"
                />
              }
              rightIcon={
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              }
              autoComplete="current-password"
              required
              containerClass="mb-1"
              inputClass={styles.inputField}
            />
          </div>

          <div className={styles.options}>
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>

            <button
              type="button"
              className={styles.forgotPassword}
              onClick={onNavigateToForgotPassword}
            >
              Forgot password?
            </button>
          </div>

          <div className={styles.submitButton}>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </div>
        </form>

        <div className={styles.signupLink}>
          <p>Don't have an account?{' '}
            <button onClick={onNavigateToRegister}>
              Sign up
            </button>
          </p>
        </div>

        <div className={styles.demoCredentials}>
          <p>Demo Credentials:</p>
          <div>
            <p><strong>Admin:</strong> admin@immopoem.com / admin123</p>
            <p><strong>Tenant:</strong> tenant@immopoem.com / tenant123</p>
            <p><strong>Maintenance:</strong> maintenance@immopoem.com / maintenance123</p>
          </div>
        </div>

        <p className={styles.copyright}>
          &copy; 2025 ImmoPoem. All rights reserved.
        </p>
      </div>
    </div>
  );
}