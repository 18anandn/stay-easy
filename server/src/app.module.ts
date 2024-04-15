import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeModule } from './home/home.module';
import { CabinModule } from './cabin/cabin.module';
import { BookingModule } from './booking/booking.module';
import { AmenityModule } from './amenity/amenity.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { OwnerModule } from './owner/owner.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { ValidationError } from 'class-validator';
import { AllExceptionsFilter } from './exceptions-filters/all.exceptions-filter';
import { NotFoundModule } from './not-found/not-found.module';


@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'front-end'),
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV === 'dev' ? 'dev' : 'prod'}`,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.getOrThrow('REDIS_HOST'),
            port: configService.getOrThrow('REDIS_PORT'),
          },
          username: configService.getOrThrow('REDIS_USER'),
          password: configService.getOrThrow('REDIS_PASSWORD'),
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
          synchronize: configService.getOrThrow('NODE_ENV') === 'dev',
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: configService.getOrThrow('MAIL_ADDRESS'),
              pass: configService.getOrThrow('MAIL_PASSWORD'),
            },
          },
          defaults: {
            from: configService.getOrThrow('MAIL_ADDRESS'),
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    HomeModule,
    CabinModule,
    BookingModule,
    AmenityModule,
    GeocodingModule,
    UploadModule,
    AdminModule,
    OwnerModule,
    NotFoundModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          const errorMessages: string[] = [];

          return new BadRequestException(
            validationErrors
              .reduce((arr, curr) => {
                if (curr.constraints) {
                  arr.push(Object.values(curr.constraints).join(', '));
                }
                return arr;
              }, errorMessages)
              .join('\n'),
          );
        },
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
