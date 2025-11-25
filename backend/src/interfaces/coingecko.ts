export type CoinGeckoData = {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: {
      usd: number;
    };
  };
  image: {
    thumb: string;
  };
};

export interface CoinDetails {
  image: string | null;
  price: number | null;
}

export interface CoinGeckoCoin {
  id: string;
  name: string;
  symbol: string;
}

export interface CoinGeckoMarketData {
  id: string;
  current_price: number;
}
