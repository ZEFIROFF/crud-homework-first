import { User } from 'generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserInput } from 'src/common/types/user.type';

export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findOneUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username, deletedAt: null },
    });
  }

  findAllUsers(
    page: number,
    limit: number,
    username?: string,
  ): Promise<User[]> {
    return this.prisma.user.findMany({
      where: username ? { username, deletedAt: null } : { deletedAt: null },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  updateUserByUsername(username: string, updateUserDto: string): Promise<User> {
    return this.prisma.user.update({
      where: { username },
      data: {
        description: updateUserDto,
      },
    });
  }

  async deleteUserByUsername(username: string): Promise<void> {
    await this.prisma.user.update({
      where: { username, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
