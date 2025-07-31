import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'sm',
  className,
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn(baseClasses, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};