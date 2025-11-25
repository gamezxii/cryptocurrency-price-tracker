import type { Metadata } from "next";
import NewCoinView from "@/features/coins/NewCoinView";

export const metadata: Metadata = {
  title: "Add Coin | Crypto Tracker",
  description: "Capture a new crypto asset entry.",
};

export default function NewCoinPage() {
  return <NewCoinView />;
}
