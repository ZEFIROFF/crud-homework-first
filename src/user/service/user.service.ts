import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, ResponseUserDto } from 'src/user/dto/user.dto';
import { UserRepository } from '../repository/user.repository';
import { User } from 'generated/prisma/client';
import { hashPassword, verifyPassword } from 'src/common/utils/crypto.util';
import { LoggerService } from 'src/common/logger/logger.service';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  findOne(username: string): Promise<User | null> {
    return this.userRepository.findOneUsername(username);
  }

  async findByUsernamePassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOneUsername(username);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!verifyPassword(password, user.password)) {
      this.logger.error(
        `Invalid password for user ${username}`,
        UserService.name,
      );
      throw new UnauthorizedException('Invalid password');
    }
    this.logger.debug(`User ${username} authenticated`, UserService.name);
    return user;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug(
      `Registering user ${createUserDto.username}`,
      UserService.name,
    );
    const existingUser = await this.userRepository.findOneUsername(
      createUserDto.username,
    ); //проверяем, существует ли пользователь с таким username
    if (existingUser) {
      this.logger.error(
        `Username ${createUserDto.username} already in use`,
        UserService.name,
      );
      throw new BadRequestException('Username already in use');
    }
    try {
      return this.userRepository.create({
        ...createUserDto,
        password: hashPassword(createUserDto.password),
      });
    } catch (error) {
      this.logger.error(
        `Error registering user ${createUserDto.username}`,
        (error as Error).message,
        UserService.name,
      );
      throw new BadRequestException((error as Error).message);
    }
  }

  async getAllUsers(
    page: number,
    limit: number,
    username?: string,
  ): Promise<ResponseUserDto[]> {
    this.logger.debug(`Getting all users`, UserService.name);
    const users = await this.userRepository.findAllUsers(page, limit, username);
    this.logger.debug(`Found ${users.length} users`, UserService.name);

    return users.map(
      (user) =>
        new ResponseUserDto({
          username: user.username,
          email: user.email,
          age: user.age,
          description: user.description || '',
          id: user.id,
        }),
    );
  }

  async getUserByUsername(username: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOneUsername(username);
    if (!user) {
      this.logger.error(`User ${username} not found`, UserService.name);
      throw new BadRequestException('User not found');
    }
    return new ResponseUserDto(user);
  }

  async updateUserByUsername(
    username: string,
    description: string,
  ): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOneUsername(username);
    if (!user) {
      this.logger.error(`User ${username} not found`, UserService.name);
      throw new BadRequestException('User not found');
    }
    return new ResponseUserDto(
      await this.userRepository.updateUserByUsername(username, description),
    );
  }

  async deleteUserByUsername(username: string): Promise<void> {
    const user = await this.userRepository.findOneUsername(username);
    if (!user) {
      this.logger.error(`User ${username} not found`, UserService.name);
      throw new BadRequestException('User not found');
    }
    await this.userRepository.deleteUserByUsername(username);
  }
}
