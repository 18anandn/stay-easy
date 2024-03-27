import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { S3File } from './s3file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([S3File])],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
