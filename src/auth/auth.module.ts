import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { UserModule } from 'src/user/user.module';
import { LoggerModule } from '../common/logger/logger.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [
    UserModule,
    LoggerModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRATION_TIME'),
        },
        refreshOptions: {
          secret: configService.get<string>('JWT_REFRESH_SECRET'),
          signOptions: {
            expiresIn: configService.get<number>('JWT_REFRESH_EXPIRATION_TIME'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
