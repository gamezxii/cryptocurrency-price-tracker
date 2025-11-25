import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptocurrencyModule } from './modules/cryptocurrency/cryptocurrency.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { Cryptocurrency } from './entities/cryptocurrency.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): SequelizeModuleOptions => {
        const sslRequired =
          configService.get<string>('SSL_REQUIRED') === 'true';

        return {
          dialect: 'postgres' as Dialect,
          host: configService.get<string>('DATABASE_HOST'),
          port: parseInt(
            configService.get<string>('DATABASE_PORT') ?? '5432',
            10,
          ),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_DB'),
          timezone: '+07:00',

          logging: configService.get<string>('DATABASE_LOG') === 'true',

          pool: {
            max: parseInt(
              configService.get<string>('DATABASE_POOL_MAX') ?? '10',
              10,
            ),
            min: parseInt(
              configService.get<string>('DATABASE_POOL_MIN') ?? '0',
              10,
            ),
            acquire: parseInt(
              configService.get<string>('DATABASE_POOL_ACQUIRE') ?? '30000',
              10,
            ),
            idle: parseInt(
              configService.get<string>('DATABASE_POOL_IDLE') ?? '10000',
              10,
            ),
          },

          dialectOptions: sslRequired
            ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: false,
                },
              }
            : undefined,

          define: {
            underscored: true,
          },
          models: [Cryptocurrency],
          autoLoadModels: true,
          synchronize: true,
        };
      },
    }),

    SequelizeModule.forFeature([Cryptocurrency]),
    CryptocurrencyModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
