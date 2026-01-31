import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variants = {
    success: 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border-[var(--color-success-200)]',
    warning: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-200)]',
    danger: 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-200)]',
    info: 'bg-[var(--color-info-50)] text-[var(--color-info-600)] border-[var(--color-info-200)]',
    default: 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)] border-[var(--color-gray-200)]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
