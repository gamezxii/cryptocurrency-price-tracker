"use client";

import { ReactNode } from "react";
import Button from "@/components/Button";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  showClose?: boolean;
};

const sizeClassMap: Record<NonNullable<DialogProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showClose = true,
}: DialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-10">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${sizeClassMap[size]} rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl`}
      >
        {(title || showClose) && (
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              {title && (
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-gray-200">{description}</p>
              )}
            </div>
            {showClose && (
              <Button
                type="button"
                variant="neutral"
                size="sm"
                className="rounded-full px-4"
                onClick={onClose}
              >
                Close
              </Button>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Dialog;
