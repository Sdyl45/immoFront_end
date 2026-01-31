import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`bg-white rounded-lg border border-[var(--color-gray-200)] shadow-sm ${
        hover ? 'transition-shadow hover:shadow-md' : ''
      } ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h3 className="mb-1">{title}</h3>
        {subtitle && <p className="text-[var(--color-gray-600)]">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
