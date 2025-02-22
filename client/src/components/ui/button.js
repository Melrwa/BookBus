"use client"; 
import React from "react";

const Button = ({ children, className = "", onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ease-in-out ${className}`}
    >
      {children}
    </button>
  );
};

export { Button };
