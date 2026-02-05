import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
  helperTextClass?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  rightIcon,
  className = '',
  containerClass = '',
  labelClass = '',
  inputClass = '',
  errorClass = '',
  helperTextClass = '',
  fullWidth = true,
  ...props 
}, ref) => {
  const inputId = React.useId();
  const hasError = Boolean(error);
  
  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-block'} ${containerClass}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`block text-sm font-medium text-gray-700 mb-1.5 ${labelClass}`}
        >
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {React.cloneElement(icon as React.ReactElement, {
              className: 'h-5 w-5 text-gray-400',
              'aria-hidden': 'true'
            })}
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          className={`block w-full h-11 rounded-lg border-0 py-2.5 ${
            icon ? 'pl-10' : 'pl-3'
          } ${
            rightIcon ? 'pr-10' : 'pr-3'
          } text-gray-900 ring-1 ring-inset ${
            hasError 
              ? 'ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500' 
              : 'ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
          } shadow-sm text-sm leading-6 bg-white transition-all duration-200 ${inputClass} ${className}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {React.cloneElement(rightIcon as React.ReactElement, {
              className: 'h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer',
              'aria-hidden': 'true'
            })}
          </div>
        )}
      </div>
      
      {hasError ? (
        <p 
          id={`${inputId}-error`}
          className={`mt-2 text-sm text-red-600 ${errorClass}`}
        >
          {error}
        </p>
      ) : helperText ? (
        <p 
          id={`${inputId}-description`}
          className={`mt-1 text-sm text-gray-500 ${helperTextClass}`}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

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
