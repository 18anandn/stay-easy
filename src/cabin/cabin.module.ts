import { Module } from '@nestjs/common';
import { CabinService } from './cabin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cabin } from './cabin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cabin])],
  providers: [CabinService]
})
export class CabinModule {}
