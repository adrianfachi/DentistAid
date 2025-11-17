// Load .env into process.env early (dependency-free)
import { readFileSync } from 'fs';
import { resolve } from 'path';
try {
  const envPath = resolve(process.cwd(), '.env');
  const env = readFileSync(envPath, 'utf8');
  env.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
    if (!m) return;
    let key = m[1]?.trim();
    let val = m[2]?.trim() ?? '';
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (key && process.env[key] === undefined) process.env[key] = val;
  });
} catch (e) {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './application/modules/app.module.js';
import { json, urlencoded } from 'express';
import initSwagger from './swagger.js';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initSwagger(app);

  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ extended: true, limit: "10mb" }));

  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
