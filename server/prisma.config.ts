import { defineConfig } from 'prisma/config';

// DATABASE_URL đọc từ .env khi chạy qua `node --env-file=.env`; Prisma CLI không tự nạp .env nên có mặc định.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations', seed: 'node --env-file=.env prisma/seed.ts' },
  datasource: { url: process.env.DATABASE_URL ?? 'file:./dev.db' },
});
