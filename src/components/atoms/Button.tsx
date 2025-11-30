'use client';

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export default function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  return (
    <button
      {...props}
    >
      {/* HTML structure removed - ready for rebuild */}
    </button>
  );
}

