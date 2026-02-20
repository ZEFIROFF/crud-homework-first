import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { DatabaseModule } from '../database/database.module';
import { LoggerModule } from '../common/logger/logger.module';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
