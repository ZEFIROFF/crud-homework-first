import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerModule } from './common/logger/logger.module';
import { v4 as uuidv4 } from 'uuid';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        if (!config['DATABASE_URL']) {
          throw new Error('DATABASE_URL is not set');
        }
        if (
          !config['SALT_OLEG'] ||
          !config['SALT_DIMA'] ||
          !config['SALT_MATTHEW']
        ) {
          throw new Error('Без моих менторов эта хуйня не запустится');
        }
        return config;
      },
    }), // глобальный модуль для конфигурации
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLE_TTL') ?? 60000,
            limit: configService.get<number>('THROTTLE_LIMIT') ?? 15,
          },
        ],
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('CACHE_TTL'),
      }),
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: () => uuidv4(),
      }, //асинхроный контекст для всех запросов
    }),
    LoggerModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    LoggerModule,
  ],
})
export class AppModule {}
