"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import ConfirmDialog from "@/components/ConfirmDialog";
import useCryptoPriceSocket, {
  normalizeSymbol as normalizeSocketSymbol,
} from "@/hooks/useCryptoPriceSocket";
import type { Coin, CoinFormValues } from "@/types/coin";
import {
  deleteCryptocurrency,
  getCryptocurrencies,
  updateCryptocurrency,
} from "@/services/cryptocurrencies";
import { CoinTable } from "./CoinTable";
import { CoinEditorDialog } from "./CoinEditorDialog";

export default function CoinDashboard() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [editingCoin, setEditingCoin] = useState<Coin | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<null | {
    variant: "success" | "error";
    message: string;
  }>(null);
  const [coinToDelete, setCoinToDelete] = useState<Coin | null>(null);
  const normalizeCoinSymbol = useCallback(
    (symbol: string) => normalizeSocketSymbol(symbol || ""),
    []
  );

  const syncCoins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCryptocurrencies();
      setCoins(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load cryptocurrencies.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncCoins();
  }, [syncCoins]);

  const openEditor = (coin: Coin) => {
    setEditingCoin(coin);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingCoin(null);
  };

  const handleEditSubmit = async (coinId: string, values: CoinFormValues) => {
    const updated = await updateCryptocurrency(coinId, values);
    setCoins((prev) =>
      prev.map((coin) => (coin.id === coinId ? updated : coin))
    );
    setBanner({ variant: "success", message: `${updated.name} updated.` });
  };

  const handleLivePriceUpdate = useCallback(
    (symbol: string, price: string) => {
      setCoins((prev) => {
        let changed = false;
        const next = prev.map((coin) => {
          if (normalizeCoinSymbol(coin.symbol) !== symbol) {
            return coin;
          }
          changed = true;
          return { ...coin, price };
        });
        return changed ? next : prev;
      });
    },
    [normalizeCoinSymbol]
  );

  const handleLiveDelete = useCallback(
    (symbol: string) => {
      setCoins((prev) => {
        const next = prev.filter(
          (coin) => normalizeCoinSymbol(coin.symbol) !== symbol
        );
        return next.length === prev.length ? prev : next;
      });
    },
    [normalizeCoinSymbol]
  );

  useCryptoPriceSocket({
    onPriceUpdate: handleLivePriceUpdate,
    onPriceDelete: handleLiveDelete,
  });

  const requestDelete = (coin: Coin) => {
    setCoinToDelete(coin);
  };

  const closeDeleteDialog = () => {
    setCoinToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!coinToDelete) return;
    try {
      await deleteCryptocurrency(coinToDelete.id);
      setCoins((prev) => prev.filter((item) => item.id !== coinToDelete.id));
      setBanner({
        variant: "success",
        message: `${coinToDelete.name} deleted.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete cryptocurrency.";
      setBanner({ variant: "error", message });
    } finally {
      closeDeleteDialog();
    }
  };

  const sortedCoins = useMemo(
    () => [...coins].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)),
    [coins]
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                Live Cryptocurrency Price Tracker
              </h1>
            </div>
            <div className="flex gap-3">
              <Link
                href="/coins/new"
                className="rounded-2xl bg-indigo-500 px-5 py-2 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-600"
              >
                + Add Coin
              </Link>
            </div>
          </div>

          {banner && (
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                banner.variant === "error"
                  ? "border-red-500/40 bg-red-500/10 text-red-200"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {banner.message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/60 bg-red-500/10 p-6 text-sm text-red-100">
              <p className="font-semibold">Unable to load coins.</p>
              <p>{error}</p>
              <Button
                type="button"
                variant="dangerOutline"
                size="sm"
                className="mt-4 rounded-full px-4 uppercase tracking-[0.3em]"
                onClick={() => syncCoins()}
              >
                Try again
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-300">
              Fetching latest prices...
            </div>
          ) : (
            <CoinTable
              coins={sortedCoins}
              onEdit={openEditor}
              onDelete={requestDelete}
            />
          )}
        </div>
      </section>

      <CoinEditorDialog
        coin={editingCoin}
        isOpen={isEditorOpen}
        onClose={closeEditor}
        onSubmit={handleEditSubmit}
      />

      <ConfirmDialog
        isOpen={!!coinToDelete}
        onCancel={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        confirmLabel="Delete"
        destructive
        title={coinToDelete ? `Delete ${coinToDelete.name}?` : "Delete coin"}
        description="This action cannot be undone."
      >
        {coinToDelete && (
          <p>
            This will remove <strong>{coinToDelete.name}</strong> (
            {coinToDelete.symbol}) from your dashboard.
          </p>
        )}
      </ConfirmDialog>
    </main>
  );
}
