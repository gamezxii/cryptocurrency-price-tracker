import { WsEvent } from 'src/enums/event.enum';

export interface PriceEventPayload {
  symbol: string;
  price?: number;
  action: WsEvent;
}
