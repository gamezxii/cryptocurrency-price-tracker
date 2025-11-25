export type Coin = {
  id: string;
  name: string;
  symbol: string;
  price: string;
  createdAt: string;
  updatedAt?: string;
};

export type CoinFormValues = Pick<Coin, "name" | "symbol" | "price">;
