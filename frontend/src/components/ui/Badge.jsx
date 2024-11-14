// src/components/ui/Badge.jsx
import React from 'react';

const Badge = ({ variant, children, className }) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded text-sm font-medium";
  const variantClasses = {
    secondary: "bg-gray-200 text-gray-800",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;