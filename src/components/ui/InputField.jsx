'use client';

import React from 'react';

const InputField = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  id,
  disabled = false,
  required = false,
  className = '',
  label,
  error,
  ...props
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200';
  
  const stateClasses = {
    default: 'border-gray-300 bg-white text-gray-900',
    error: 'border-red-500 bg-red-50 text-red-900',
    disabled: 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed',
  };
  
  const getStateClass = () => {
    if (disabled) return stateClasses.disabled;
    if (error) return stateClasses.error;
    return stateClasses.default;
  };
  
  const inputClasses = `${baseClasses} ${getStateClass()} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default InputField;