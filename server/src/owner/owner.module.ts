import { Module } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from '../home/home.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Home]), UploadModule],
  providers: [OwnerService],
  controllers: [OwnerController]
})
export class OwnerModule {}
