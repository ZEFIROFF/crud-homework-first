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
      where: { username },
    });
  }
}
