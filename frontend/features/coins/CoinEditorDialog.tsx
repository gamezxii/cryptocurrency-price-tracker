"use client";

import { useMemo } from "react";
import Dialog from "@/components/Dialog";
import type { Coin, CoinFormValues } from "@/types/coin";
import { CoinForm } from "./CoinForm";

type CoinEditorDialogProps = {
  coin: Coin | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coinId: string, values: CoinFormValues) => Promise<void> | void;
};

export function CoinEditorDialog({
  coin,
  isOpen,
  onClose,
  onSubmit,
}: CoinEditorDialogProps) {
  const createdAtLabel = useMemo(() => {
    if (!coin) return "";
    return new Date(coin.createdAt).toLocaleString();
  }, [coin]);

  if (!isOpen || !coin) {
    return null;
  }

  const handleSubmit = async (values: CoinFormValues) => {
    await onSubmit(coin.id, values);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={coin.name}
      description={`Created on ${createdAtLabel}`}
      size="md"
    >
      <CoinForm
        initialValues={{
          name: coin.name,
          symbol: coin.symbol,
          price: coin.price,
        }}
        submitLabel="Update coin"
        onSubmit={handleSubmit}
        onSuccess={onClose}
      />
    </Dialog>
  );
}

export default CoinEditorDialog;
