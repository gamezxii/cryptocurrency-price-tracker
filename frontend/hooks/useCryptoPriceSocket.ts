"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { PriceEventPayload } from "@/types/socket";
import { WsEvent } from "@/types/socket";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3000";

export const normalizeSymbol = (symbol: string) =>
  symbol.replace(/USDT$/i, "").trim().toUpperCase();

type UseCryptoPriceSocketOptions = {
  onPriceUpdate?: (symbol: string, price: string) => void;
  onPriceDelete?: (symbol: string) => void;
};

export function useCryptoPriceSocket({
  onPriceUpdate,
  onPriceDelete,
}: UseCryptoPriceSocketOptions) {
  const handlersRef = useRef({ onPriceUpdate, onPriceDelete });

  useEffect(() => {
    handlersRef.current = { onPriceUpdate, onPriceDelete };
  }, [onPriceUpdate, onPriceDelete]);

  useEffect(() => {
    let socket: Socket | null = null;

    const connect = async () => {
      socket = io(SOCKET_URL, {
        transports: ["websocket"],
      });

      socket.on(WsEvent.EventName, (payload: PriceEventPayload) => {
        if (!payload || !payload.symbol) {
          return;
        }

        const normalizedSymbol = normalizeSymbol(payload.symbol);
        switch (payload.action) {
          case WsEvent.PriceUpdate:
            handlersRef.current.onPriceUpdate?.(
              normalizedSymbol,
              payload.price
            );
            break;
          case WsEvent.PriceDelete:
            handlersRef.current.onPriceDelete?.(normalizedSymbol);
            break;
          default:
            break;
        }
      });
    };

    connect();

    return () => {
      socket?.disconnect();
    };
  }, []);
}

export default useCryptoPriceSocket;
