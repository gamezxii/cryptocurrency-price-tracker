import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import { ErrorCode } from 'src/enums/error-codes.enum';
import { BinanceTickerPrice } from 'src/interfaces/binance';

@Injectable()
export class BinanceService {
  private readonly BINANCE_API_URL =
    'https://api.binance.com/api/v3/ticker/price';
  private readonly logger = new Logger(BinanceService.name);
  public readonly quoteAsset = 'USDT';

  async fetchAllPrices(): Promise<BinanceTickerPrice[]> {
    try {
      this.logger.log('Fetching all prices from Binance...');

      const { data } = await axios.get<BinanceTickerPrice[]>(
        this.BINANCE_API_URL,
      );

      if (!data.length) {
        return [];
      }

      return data;
    } catch (error) {
      this.logger.error('Failed to fetch Binance prices', error);
      throw new InternalServerErrorException({
        error_code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch Binance prices.',
      });
    }
  }

  async fetchPricesBySymbols(symbols: string[]): Promise<BinanceTickerPrice[]> {
    try {
      this.logger.log(`Fetching prices: ${symbols.join(', ')}`);

      const encoded = encodeURIComponent(
        JSON.stringify(symbols), //.map((x) => `${x}${this.quoteAsset}`)
      );
      const url = `${this.BINANCE_API_URL}?symbols=${encoded}`;

      const { data } = await axios.get<BinanceTickerPrice[]>(url);

      if (!data.length) {
        return [];
      }

      return data;
    } catch (error) {
      this.logger.error(`Failed to fetch prices for symbols`, error);

      throw new InternalServerErrorException({
        error_code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch Binance prices.',
      });
    }
  }

  async fetchPriceSymbol(symbol: string): Promise<BinanceTickerPrice> {
    try {
      this.logger.log(`Fetching price for ${symbol}`);

      const { data } = await axios.get<BinanceTickerPrice>(
        `${this.BINANCE_API_URL}?symbol=${symbol}`,
      );

      if (!data) {
        throw new InternalServerErrorException(`No price found for ${symbol}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Failed to fetch price for ${symbol}`, error);
      throw new InternalServerErrorException({
        error_code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: `Failed to fetch price for ${symbol}`,
      });
    }
  }
}
