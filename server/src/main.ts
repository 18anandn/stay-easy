import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import { join } from 'path';
import dns from 'dns';
import os from 'os';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // console.log(process.cwd());
  // app.useStaticAssets(join(process.cwd(), 'front-end'));
  app.use(express.static(join(process.cwd(), 'front-end')));
  await app.listen(3000);
}
bootstrap();
