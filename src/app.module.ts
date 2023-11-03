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
import { TypeORMExceptionFilter } from './filters/typeorm-exception.filter';
import cookieParser from 'cookie-parser';
import { delayer } from './middlewares/delay-response.middleware';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelModule } from './hotel/hotel.module';
import { CabinModule } from './cabin/cabin.module';
import { BookingModule } from './booking/booking.module';
import { AmenityModule } from './amenity/amenity.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import { UploadModule } from './upload/upload.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('QUEUE_HOST'),
          port: configService.get('QUEUE_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    HotelModule,
    CabinModule,
    BookingModule,
    AmenityModule,
    GeocodingModule,
    UploadModule,
    TestModule,
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
        exceptionFactory: (errors) => {
          const error = !!errors[0].children.length
            ? errors[0].children[0].constraints
            : errors[0].constraints;

          return new BadRequestException(Object.values(error)[0]);
        },
      }),
    },
  ],
})

export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(delayer(1500)).forRoutes('*');
    consumer
      .apply(cookieParser(this.configService.get('JWT_SECRET')))
      .forRoutes('*');
  }
}
