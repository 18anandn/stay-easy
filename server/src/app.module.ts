import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeORMExceptionFilter } from './filters/typeorm-exception.filter';
import cookieParser from 'cookie-parser';
import { delayer } from './middlewares/delay-response.middleware';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeModule } from './home/home.module';
import { CabinModule } from './cabin/cabin.module';
import { BookingModule } from './booking/booking.module';
import { AmenityModule } from './amenity/amenity.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import { UploadModule } from './upload/upload.module';
import { TestModule } from './test/test.module';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { NotFoundModule } from './not-found/not-found.module';
import { OwnerModule } from './owner/owner.module';
import express from 'express';
import { ServeStaticMiddleware } from './middlewares/serve-static.middleware';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'front-end'),
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.getOrThrow('QUEUE_HOST'),
            port: configService.getOrThrow('QUEUE_PORT'),
          },
          username: configService.getOrThrow('QUEUE_USER'),
          password: configService.getOrThrow('QUEUE_PASSWORD'),
        });
        return {
          store,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.getOrThrow('DB_HOST'),
          port: configService.getOrThrow('DB_PORT'),
          username: configService.getOrThrow('DB_USER'),
          password: configService.getOrThrow('DB_PASSWORD'),
          database: configService.getOrThrow('DB_NAME'),
          autoLoadEntities: true,
          useUTC: true,
          // cache: {
          //   type: 'ioredis',
          //   options: {
          //     host: configService.getOrThrow('QUEUE_HOST'),
          //     port: configService.getOrThrow('QUEUE_PORT'),
          //     username: configService.getOrThrow('QUEUE_USER'),
          //     password: configService.getOrThrow('QUEUE_PASSWORD'),
          //   },
          // },
          synchronize: configService.getOrThrow('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     redis: {
    //       host: configService.getOrThrow('QUEUE_HOST'),
    //       port: configService.getOrThrow('QUEUE_PORT'),
    //       username: configService.getOrThrow('QUEUE_USER'),
    //       password: configService.getOrThrow('QUEUE_PASSWORD'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    UserModule,
    HomeModule,
    CabinModule,
    BookingModule,
    AmenityModule,
    GeocodingModule,
    UploadModule,
    TestModule,
    AdminModule,
    OwnerModule,
    // NotFoundModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: TypeORMExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        // exceptionFactory: (errors) => {
        //   const error = !!errors[0].children.length
        //     ? errors[0].children[0].constraints
        //     : errors[0].constraints;

        //   return new BadRequestException(Object.values(error)[0]);
        // },
      }),
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(delayer(2000)).forRoutes('*');
    // consumer
    //   .apply(
    //     express.static(join(process.cwd(), 'front-end'), {
    //       extensions: ['js'],
    //     }),
    //   )
    //   .forRoutes('*');
    // consumer.apply(ServeStaticMiddleware).forRoutes('*');
    consumer
      .apply(cookieParser(this.configService.get('JWT_SECRET')))
      .forRoutes('*');
  }
}
