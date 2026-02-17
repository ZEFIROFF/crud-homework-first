import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    CacheModule.register({
      ttl: 5000,
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true }, //асинхроный контекст для всех запросов
    }),
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }), // асинхронный модуль для typeorm и постгры
      inject: [ConfigService],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
