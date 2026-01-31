import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export function Input({ 
  label, 
  error, 
  helperText, 
  icon,
  className = '',
  ...props 
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[var(--color-gray-700)]">
          {label}
          {props.required && <span className="text-[var(--color-danger-500)] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-2.5 ${icon ? 'pl-10' : ''} rounded-lg border ${
            error 
              ? 'border-[var(--color-danger-500)] focus:ring-2 focus:ring-[var(--color-danger-200)]' 
              : 'border-[var(--color-gray-300)] focus:ring-2 focus:ring-[var(--color-primary-200)] focus:border-[var(--color-primary-500)]'
          } outline-none transition-all bg-white ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[var(--color-danger-600)]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-[var(--color-gray-500)]">{helperText}</p>
      )}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function TextArea({ 
  label, 
  error, 
  helperText,
  className = '',
  ...props 
}: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[var(--color-gray-700)]">
          {label}
          {props.required && <span className="text-[var(--color-danger-500)] ml-1">*</span>}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error 
            ? 'border-[var(--color-danger-500)] focus:ring-2 focus:ring-[var(--color-danger-200)]' 
            : 'border-[var(--color-gray-300)] focus:ring-2 focus:ring-[var(--color-primary-200)] focus:border-[var(--color-primary-500)]'
        } outline-none transition-all bg-white resize-vertical ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-[var(--color-danger-600)]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-[var(--color-gray-500)]">{helperText}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export function Select({ 
  label, 
  error, 
  helperText,
  options,
  className = '',
  ...props 
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[var(--color-gray-700)]">
          {label}
          {props.required && <span className="text-[var(--color-danger-500)] ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error 
            ? 'border-[var(--color-danger-500)] focus:ring-2 focus:ring-[var(--color-danger-200)]' 
            : 'border-[var(--color-gray-300)] focus:ring-2 focus:ring-[var(--color-primary-200)] focus:border-[var(--color-primary-500)]'
        } outline-none transition-all bg-white ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-[var(--color-danger-600)]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-[var(--color-gray-500)]">{helperText}</p>
      )}
    </div>
  );
}
