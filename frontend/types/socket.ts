export enum WsEvent {
  EventName = "ticker",
  PriceCreate = "price.create",
  PriceUpdate = "price.update",
  PriceDelete = "price.delete",
}

export type PriceEventPayload = {
  symbol: string;
  price: string;
  action: WsEvent;
};
