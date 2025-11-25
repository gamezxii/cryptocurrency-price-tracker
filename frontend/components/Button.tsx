"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "outline"
  | "accent"
  | "dangerOutline"
  | "neutral";

type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 hover:shadow-indigo-400/50",
  outline: "border border-white/20 text-white hover:bg-white/10",
  accent: "border border-indigo-400/40 text-indigo-200 hover:bg-indigo-500/20",
  dangerOutline: "border border-red-400/40 text-red-200 hover:bg-red-500/20",
  neutral: "border border-slate-400 text-slate-100 hover:bg-slate-700/40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      fullWidth = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    const classes = [
      "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 hover:-translate-y-0.5",
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} type={type} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
