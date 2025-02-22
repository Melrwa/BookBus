import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div className={`rounded-xl shadow-md bg-gray-900 p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children }) => {
  return <div className="p-2">{children}</div>;
};

export { Card, CardContent };
