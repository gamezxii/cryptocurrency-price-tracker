import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCryptocurrencyDto } from './dto/create-cryptocurrency.dto';
import { UpdateCryptocurrencyDto } from './dto/update-cryptocurrency.dto';
import { BinanceService } from 'src/http/binance.service';
import { BulkUpsertCryptocurrencyDto } from './dto/bulk-upsert-cryptocurrency.dto';
import { WebsocketService } from '../websocket/websocket.service';
import { WsEvent } from 'src/enums/event.enum';
import { UniqueConstraintError } from 'sequelize';
import { ErrorCode } from 'src/enums/error-codes.enum';
import { BinanceStreamService } from '../scheduler/binanace-stream.service';
import { Cryptocurrency } from 'src/entities/cryptocurrency.entity';

@Injectable()
export class CryptocurrencyService {
  public currentSymbols = new Set<string>();

  constructor(
    @InjectModel(Cryptocurrency)
    private readonly cryptocurrencyModel: typeof Cryptocurrency,
    private binanceService: BinanceService,
    @Inject(forwardRef(() => WebsocketService))
    private readonly wsService: WebsocketService,
    private readonly binanceStresmService: BinanceStreamService,
  ) {
    this.inital();
  }

  async inital(): Promise<void> {
    const symbols = await this.findAll();
    for (const symbol of symbols) {
      this.currentSymbols.add(
        `${symbol.symbol}${this.binanceService.quoteAsset}`,
      );
    }
  }

  async create(
    createCryptocurrencyDto: CreateCryptocurrencyDto,
  ): Promise<Cryptocurrency> {
    try {
      const crypto = await this.cryptocurrencyModel.create({
        ...createCryptocurrencyDto,
      });

      const fullSymbol = `${crypto.symbol}${this.binanceService.quoteAsset}`;

      this.currentSymbols.add(fullSymbol);

      await this.binanceStresmService.subscribeNewSymbol(fullSymbol);

      this.wsService.emitToAll(WsEvent.EventName, {
        symbol: crypto.symbol,
        price: crypto.price,
        action: WsEvent.PriceCreate,
      });

      return crypto;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new BadRequestException({
          error_code: ErrorCode.CRYPTO_SYMBOL_ALREADY_EXISTS,
          message: `Cryptocurrency with symbol "${createCryptocurrencyDto.symbol}" already exists.`,
        });
      }

      throw new InternalServerErrorException({
        error_code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Failed to create cryptocurrency.',
      });
    }
  }

  findAll(): Promise<Cryptocurrency[]> {
    return this.cryptocurrencyModel.findAll();
  }

  async findOne(id: string): Promise<Cryptocurrency> {
    const cryptocurrency = await this.cryptocurrencyModel.findByPk(id);

    if (!cryptocurrency) {
      throw new NotFoundException({
        error_code: ErrorCode.NOT_FOUND,
        message: `Cryptocurrency with id "${id}" not found.`,
      });
    }

    return cryptocurrency;
  }

  async update(
    id: string,
    dto: UpdateCryptocurrencyDto,
  ): Promise<Cryptocurrency> {
    const cryptocurrency = await this.findOne(id);

    const updated = await cryptocurrency.update(dto);

    this.wsService.emitToAll(WsEvent.EventName, {
      symbol: updated.symbol,
      action: WsEvent.PriceUpdate,
      price: updated.price,
    });

    return updated;
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const cryptocurrency = await this.findOne(id);
    const fullSymbol = `${cryptocurrency.symbol}${this.binanceService.quoteAsset}`;

    await cryptocurrency.destroy();

    this.currentSymbols.delete(fullSymbol);
    await this.binanceStresmService.unsubscribeSymbol(fullSymbol);

    this.wsService.emitToAll(WsEvent.EventName, {
      symbol: cryptocurrency.symbol,
      action: WsEvent.PriceDelete,
    });

    return {
      id,
      deleted: true,
    };
  }

  async bulkUpsertBySymbol(
    items: BulkUpsertCryptocurrencyDto[],
  ): Promise<Cryptocurrency[]> {
    if (!items.length) {
      return [];
    }

    const rows = items.map((item) => ({
      symbol: item.symbol,
      price: item.price,
    }));

    return this.cryptocurrencyModel.bulkCreate(rows, {
      updateOnDuplicate: ['price', 'updated_at'],
      conflictAttributes: ['symbol'],
    });
  }
}
