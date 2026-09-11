import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { prisma } from './db.ts';

export const SESSION_COOKIE = 'sid';
const SESSION_DAYS = 30;

// scrypt có sẵn trong Node, không cần bcrypt. Lưu dạng "salt:hash" hex.
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function createSession(userId: string): Promise<string> {
  const id = randomBytes(32).toString('base64url');
  await prisma.session.create({
    data: { id, userId, expiresAt: new Date(Date.now() + SESSION_DAYS * 86_400_000) },
  });
  return id;
}

export async function destroySession(id: string | undefined): Promise<void> {
  if (id) await prisma.session.deleteMany({ where: { id } });
}

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;

export async function getSessionUser(sid: string | undefined) {
  if (!sid) return null;
  const session = await prisma.session.findUnique({
    where: { id: sid },
    include: { user: { include: { student: true } } },
  });
  if (!session || session.expiresAt < new Date() || session.user.status !== 'active') return null;
  return session.user;
}

export type AuthEnv = { Variables: { user: SessionUser } };

// Gắn user vào context; 401 nếu chưa đăng nhập. Dùng: app.use('/api/me', requireUser)
export const requireUser: MiddlewareHandler<AuthEnv> = async (c, next) => {
  const user = await getSessionUser(getCookie(c, SESSION_COOKIE));
  if (!user) return c.json({ error: { code: 'UNAUTHENTICATED', message: 'Bạn chưa đăng nhập hoặc phiên đã hết hạn.' } }, 401);
  c.set('user', user);
  await next();
};
