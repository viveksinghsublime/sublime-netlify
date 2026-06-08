'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const Dropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSelect = (option) => {
    onChange && onChange(option);
    setIsOpen(false);
  };
  
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef} {...props}>
      <button
        type="button"
        className="w-full px-3 py-2.5 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-between"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="text-gray-900 text-sm">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Image 
          src="/images/img_group.svg" 
          alt="Dropdown Arrow" 
          width={24} 
          height={24}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-3 py-2 text-left text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;