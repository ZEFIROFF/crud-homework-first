import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { UserRepository } from '../repository/user.repository';
import { User } from 'generated/prisma/client';
import { hashPassword, verifyPassword } from 'src/common/utils/crypto.util';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneUsername(
      createUserDto.username,
    ); //проверяем, существует ли пользователь с таким username
    if (existingUser) {
      throw new BadRequestException('Username already in use');
    }
    try {
      return this.userRepository.create({
        ...createUserDto,
        password: hashPassword(createUserDto.password),
      });
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
