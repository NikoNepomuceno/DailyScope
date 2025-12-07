'use client';

import React from "react";
import styles from "./Button.module.css";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export default function Button({ className = "", variant = "default", children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
