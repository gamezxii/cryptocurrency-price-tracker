"use client";

import { formatCryptoPrice } from "@/commons/utils";
import Button from "@/components/Button";
import type { Coin } from "@/types/coin";
import Image from "next/image";

type CoinTableProps = {
  coins: Coin[];
  onEdit: (coin: Coin) => void;
  onDelete?: (coin: Coin) => void;
};

export function CoinTable({ coins, onEdit, onDelete }: CoinTableProps) {
  if (coins.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-300">
        <p className="text-lg font-medium">No coins tracked yet.</p>
        <p className="text-sm text-slate-400">
          Use the add button above to capture your first asset.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800 text-xs uppercase tracking-widest text-slate-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr
              key={coin.id}
              className="border-t border-slate-800/80 text-slate-200 transition hover:bg-white/5"
            >
              <td className="px-4 py-4 text-base font-semibold">
                <div className="flex items-center gap-3">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CRYPTO_ICON}/${coin.symbol
                      .replace("USDT", "")
                      .toLowerCase()}.svg`}
                    alt={coin.symbol}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>{coin.name}</div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm font-semibold text-slate-200">
                {coin.symbol}/USDT
              </td>
              <td className="px-4 py-4 text-right text-base font-medium">
                {formatCryptoPrice(coin.price)}
              </td>
              <td className="px-4 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="accent"
                    size="sm"
                    onClick={() => onEdit(coin)}
                  >
                    Edit
                  </Button>
                  {onDelete && (
                    <Button
                      type="button"
                      variant="dangerOutline"
                      size="sm"
                      onClick={() => onDelete(coin)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CoinTable;
