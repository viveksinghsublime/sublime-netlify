'use client';

import React from 'react';

const Chip = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  removable = false,
  onRemove,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors duration-200';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-200 text-gray-700',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    light: 'bg-gray-50 text-gray-600',
  };
  
  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base',
  };
  
  const chipClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <span className={chipClasses} {...props}>
      {children}
      {removable && (
        <button
          type="button"
          className="ml-1 text-current hover:text-gray-600 focus:outline-none"
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default Chip;