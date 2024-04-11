import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import { join } from 'path';
import 'reflect-metadata';
import 'es6-shim';
import { ServeStaticMiddleware } from './middlewares/serve-static.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // console.log(process.cwd());
  // app.useStaticAssets(join(process.cwd(), 'front-end'));
  // console.log('outside', join(process.cwd(), 'front-end'));
  // app.use(express.static(join(process.cwd(), 'front-end')));
  await app.listen(3000);
}
bootstrap();
