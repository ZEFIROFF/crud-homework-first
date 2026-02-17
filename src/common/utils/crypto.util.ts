// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt') as {
  hashSync: (s: string, r: number) => string;
  compareSync: (s: string, h: string) => boolean;
};

const SALT_ROUNDS = 10;

function getPepper(): string {
  const o = process.env.SALT_OLEG;
  const d = process.env.SALT_DIMA;
  const m = process.env.SALT_MATTHEW;
  if (!o || !d || !m) throw new Error('Але вставь мем обратно');
  return o + d + m;
}

export function hashPassword(password: string): string {
  if (!password) throw new Error('Password is not defined');
  return bcrypt.hashSync(password + getPepper(), SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): boolean {
  if (!password || !hash) throw new Error('Password or hash is not defined');
  return bcrypt.compareSync(password + getPepper(), hash);
}
