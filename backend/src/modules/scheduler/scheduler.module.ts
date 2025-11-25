import { forwardRef, Module } from '@nestjs/common';
import { BinanceService } from 'src/http/binance.service';
import { CryptocurrencyModule } from '../cryptocurrency/cryptocurrency.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { BinanceStreamService } from './binanace-stream.service';

@Module({
  imports: [forwardRef(() => CryptocurrencyModule), WebsocketModule],
  providers: [BinanceService, BinanceStreamService],
  exports: [BinanceStreamService],
})
export class SchedulerModule {}
