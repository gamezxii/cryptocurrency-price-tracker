"use client";

import { ReactNode, useState } from "react";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";

type ConfirmDialogProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  children?: ReactNode;
};

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onCancel,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onCancel} title={title} description={description} size="sm">
      {children && <div className="mb-4 text-sm text-slate-600">{children}</div>}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="neutral"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={destructive ? "dangerOutline" : "primary"}
          size="sm"
          onClick={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
