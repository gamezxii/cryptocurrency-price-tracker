import type { Metadata } from "next";
import CoinDashboard from "@/features/coins/CoinDashboard";

export const metadata: Metadata = {
  title: "Coin Dashboard | Crypto Tracker",
  description: "TradingView-style overview of your tracked crypto assets.",
};

export default function CoinsPage() {
  return <CoinDashboard />;
}
