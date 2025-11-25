import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  forwardRef,
  Inject,
} from '@nestjs/common';
import WebSocket from 'ws';
import { WsEvent } from 'src/enums/event.enum';
import { CryptocurrencyService } from 'src/modules/cryptocurrency/cryptocurrency.service';
import { WebsocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class BinanceStreamService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BinanceStreamService.name);
  private ws?: WebSocket;
  private readonly quoteAsset = 'usdt';
  private subscribed = new Set<string>(); 

  constructor(
    @Inject(forwardRef(() => CryptocurrencyService))
    private readonly cryptocurrencyService: CryptocurrencyService,
    private readonly wsService: WebsocketService,
  ) {}

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    this.ws?.close();
  }

  private connect() {
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws');

    this.ws.on('open', () => {
      this.logger.log('Connected to Binance WS');
      this.resubscribeAll();
    });

    this.ws.on('message', async (raw) => {
      const msg = JSON.parse(raw.toString());

      this.logger.debug(`Received WS message: ${raw.toString()}`);

      // miniTicker event format: { s: 'BTCUSDT', c: '12345.67', ... }
      if (msg.e === '24hrMiniTicker') {
        const symbol = msg.s.replace(this.quoteAsset.toUpperCase(), '');
        const price = parseFloat(msg.c);

        // upsert DB
        const [crypto] = await this.cryptocurrencyService.bulkUpsertBySymbol([
          { symbol, price },
        ]);

        
        this.wsService.emitToAll(WsEvent.EventName, {
          symbol: crypto.symbol,
          price: crypto.price,
          action: WsEvent.PriceUpdate,
        });
      }
    });

    this.ws.on('close', () => {
      this.logger.warn('Binance WS closed. Reconnecting...');
      setTimeout(() => this.connect(), 1000);
    });

    this.ws.on('error', (err) => {
      this.logger.error('Binance WS error', err);
    });
  }

  
  async resubscribeAll() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const symbols = Array.from(this.cryptocurrencyService.currentSymbols);
    const params = symbols.map((s) => `${s.toLowerCase()}@miniTicker`);

    console.log(params);

    this.subscribed = new Set(params);

    this.ws.send(
      JSON.stringify({
        method: 'SUBSCRIBE',
        params,
        id: 1,
      }),
    );
  }

  async subscribeNewSymbol(symbol: string) {
    const streamName = `${symbol.toLowerCase()}@miniTicker`;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    if (this.subscribed.has(streamName)) return;

    this.subscribed.add(streamName);
    this.ws.send(
      JSON.stringify({
        method: 'SUBSCRIBE',
        params: [streamName],
        id: Date.now(),
      }),
    );

    this.logger.log(`Subscribed to ${streamName}`);
  }

  async unsubscribeSymbol(symbol: string) {
    const streamName = `${symbol.toLowerCase()}@miniTicker`;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    if (!this.subscribed.has(streamName)) return;

    this.subscribed.delete(streamName);
    this.ws.send(
      JSON.stringify({
        method: 'UNSUBSCRIBE',
        params: [streamName],
        id: Date.now(),
      }),
    );

    this.logger.log(`Unsubscribed from ${streamName}`);
  }
}
