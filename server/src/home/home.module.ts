import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { UtilsModule } from '../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from './home.entity';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { UploadModule } from '../upload/upload.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([Home]),
    UtilsModule,
    GeocodingModule,
    UploadModule,
    NestjsFormDataModule,
  ],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
