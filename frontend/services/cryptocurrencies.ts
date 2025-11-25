import type { Coin, CoinFormValues } from "@/types/coin";

type ApiCoin = {
  id: string;
  name: string;
  symbol: string;
  price: string;
  created_at: string;
  updated_at?: string;
};

type ApiError = {
  status_code: number;
  error_code: string;
  data?: {
    message?: string;
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/v1";

const parseJson = async <T>(response: Response): Promise<T | null> => {
  if (response.status === 204) {
    return null;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = await parseJson<T | ApiError>(response);

  if (!response.ok) {
    const errorPayload = payload as ApiError | null;
    const errorMessage =
      errorPayload?.data?.message ||
      (typeof errorPayload === "object" &&
      errorPayload &&
      "message" in errorPayload
        ? String((errorPayload as Record<string, unknown>).message)
        : null) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return (payload as T | null) ?? ({} as T);
};

const formatPrice = (price: string): string => {
  const parsedPrice = parseFloat(price);
  return parsedPrice.toFixed(8);
};
const mapCoin = (coin: ApiCoin): Coin => ({
  id: coin.id,
  name: coin.name,
  symbol: coin.symbol.toUpperCase(),
  price: formatPrice(coin.price),
  createdAt: coin.created_at,
  updatedAt: coin.updated_at,
});

const buildBody = (values: CoinFormValues) =>
  JSON.stringify({
    name: values.name,
    symbol: values.symbol.toUpperCase(),
    price: formatPrice(values.price),
  });

export const getCryptocurrencies = async (): Promise<Coin[]> => {
  const data = await request<ApiCoin[]>("/v1/cryptocurrencies", {
    method: "GET",
  });
  return Array.isArray(data) ? data.map(mapCoin) : [];
};

export const createCryptocurrency = async (
  values: CoinFormValues
): Promise<Coin> => {
  const data = await request<ApiCoin>("/v1/cryptocurrencies", {
    method: "POST",
    body: buildBody(values),
  });
  return mapCoin(data);
};

export const updateCryptocurrency = async (
  coinId: string,
  values: CoinFormValues
): Promise<Coin> => {
  const data = await request<ApiCoin>(`/v1/cryptocurrencies/${coinId}`, {
    method: "PUT",
    body: buildBody(values),
  });
  return mapCoin(data);
};

export const deleteCryptocurrency = async (coinId: string): Promise<void> => {
  await request(`/v1/cryptocurrencies/${coinId}`, {
    method: "DELETE",
  });
};
