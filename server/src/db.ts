import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/prisma/client.ts';

const url = process.env.DATABASE_URL ?? 'file:./dev.db';

export const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
