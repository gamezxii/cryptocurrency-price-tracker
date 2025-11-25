"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CoinFormValues } from "@/types/coin";
import { createCryptocurrency } from "@/services/cryptocurrencies";
import { CoinForm } from "./CoinForm";

export default function NewCoinView() {
  const router = useRouter();

  const handleSubmit = async (values: CoinFormValues) => {
    await createCryptocurrency(values);
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-indigo-500">
              Add asset
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              Create a new crypto entry
            </h1>
          </div>
          <Link
            href="/coins"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Back
          </Link>
        </div>

        <CoinForm submitLabel="Save coin" onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
