import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from '../upload/upload.module';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { Test } from './test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Test]), UploadModule, GeocodingModule],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
