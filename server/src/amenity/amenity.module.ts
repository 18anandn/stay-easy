import { Module } from '@nestjs/common';
import { AmenityService } from './amenity.service';
import { AmenityController } from './amenity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amenity } from './amenity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amenity])],
  providers: [AmenityService],
  controllers: [AmenityController]
})
export class AmenityModule {}
