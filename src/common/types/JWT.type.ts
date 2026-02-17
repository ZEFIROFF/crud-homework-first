import { User } from 'generated/prisma/client';

export type JwtPayload = Pick<User, 'id' | 'username'>;
export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
