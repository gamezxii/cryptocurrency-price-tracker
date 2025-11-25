import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CryptocurrencyService } from './cryptocurrency.service';
import { CryptocurrencyController } from './cryptocurrency.controller';
import { BinanceService } from 'src/http/binance.service';
import { WebsocketModule } from '../websocket/websocket.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { Cryptocurrency } from 'src/entities/cryptocurrency.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Cryptocurrency]),
    WebsocketModule,
    forwardRef(() => SchedulerModule),
  ],
  controllers: [CryptocurrencyController],
  providers: [CryptocurrencyService, BinanceService],
  exports: [CryptocurrencyService],
})
export class CryptocurrencyModule {}
