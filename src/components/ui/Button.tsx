'use client';

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  const base = "px-3 py-2 rounded-md transition-colors";
  const styles =
    variant === "outline"
      ? "border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      : "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <button
      className={`${base} ${styles} ${className}`}
      {...props}
    />
  );
}
