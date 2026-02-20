import type { User } from 'generated/prisma/client';

export type ResponseUser = Pick<
  User,
  'id' | 'email' | 'username' | 'age' | 'description'
>;

export type CreateUserInput = Pick<
  User,
  'username' | 'email' | 'password' | 'age' | 'description'
>;

export type UpdateUserInput = Partial<CreateUserInput>;
