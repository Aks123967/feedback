import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'px-5 py-2.5 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
    ghost: 'hover:bg-gray-100 text-gray-600 hover:text-gray-900',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'text-sm',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};