'use client';

import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'default',
  shadow = 'default',
  border = true,
  ...props 
}) => {
  const baseClasses = 'rounded-lg';
  
  const variants = {
    default: 'bg-white',
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-50',
    transparent: 'bg-transparent',
  };
  
  const paddings = {
    none: 'p-0',
    small: 'p-4',
    default: 'p-6',
    large: 'p-8',
  };
  
  const shadows = {
    none: '',
    small: 'shadow-sm',
    default: 'shadow-md',
    large: 'shadow-lg',
  };
  
  const borders = {
    true: 'border border-gray-200',
    false: '',
  };
  
  const cardClasses = `
    ${baseClasses} 
    ${variants[variant]} 
    ${paddings[padding]} 
    ${shadows[shadow]} 
    ${borders[border]} 
    ${className}
  `.trim();
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;