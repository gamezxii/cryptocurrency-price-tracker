"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Button from "@/components/Button";
import type { CoinFormValues } from "@/types/coin";

type CoinFormProps = {
  initialValues?: CoinFormValues;
  submitLabel: string;
  onSubmit: (values: CoinFormValues) => Promise<void> | void;
  onSuccess?: () => void;
};

type InternalFormState = {
  name: string;
  symbol: string;
  price: string;
};

const toInternalState = (values?: CoinFormValues): InternalFormState => ({
  name: values?.name ?? "",
  symbol: values?.symbol ?? "",
  price: values ? String(values.price) : "",
});

export function CoinForm({
  initialValues,
  submitLabel,
  onSubmit,
  onSuccess,
}: CoinFormProps) {
  const [formValues, setFormValues] = useState<InternalFormState>(() =>
    toInternalState(initialValues)
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!initialValues) return;
    setFormValues(toInternalState(initialValues));
    setError(null);
  }, [initialValues?.symbol]);

  const updateField =
    (field: keyof InternalFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setFormValues((previous) => ({
        ...previous,
        [field]: field === "symbol" ? nextValue.toUpperCase() : nextValue,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = formValues.name.trim();
    const trimmedSymbol = formValues.symbol.trim().toUpperCase();
    const parsedPrice = formValues.price;

    if (!trimmedName || !trimmedSymbol) {
      setError("Name and symbol are required.");
      return;
    }

    if (Number.isNaN(parsedPrice) || parseFloat(parsedPrice) <= 0) {
      setError("Enter a valid price greater than 0.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: trimmedName,
        symbol: trimmedSymbol,
        price: parsedPrice,
      });
      onSuccess?.();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to save coin.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Coin name
        </label>
        <input
          value={formValues.name}
          onChange={updateField("name")}
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-500/20"
          placeholder="Bitcoin"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Symbol
        </label>
        <input
          value={formValues.symbol}
          onChange={updateField("symbol")}
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 uppercase tracking-wide text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-500/20"
          placeholder="BTC"
          maxLength={10}
          disabled={!!initialValues?.symbol}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Price (USD)
        </label>
        <input
          value={formValues.price}
          onChange={updateField("price")}
          type="number"
          inputMode="decimal"
          step="0.00000001"
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-500/20"
          placeholder="68000"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

export default CoinForm;
