import { AdminService } from './admin.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { GetHomeListDto } from './dtos/get-home-list.dto';
import { UUIDDto } from '../dtos/uuid.dto';
import { UpdateHomeDto } from './dtos/update-home.dto';

@Controller('api/v1/admin')
@AuthGuard(['admin'])
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('homelist')
  getHomeList(@Query() params: GetHomeListDto) {
    return this.adminService.getHomeList(params);
  }

  @Get('home/:id')
  getHome(@Param() { id }: UUIDDto) {
    return this.adminService.getHome(id);
  }

  @Patch('home/:id')
  updateHome(@Param() { id }: UUIDDto, @Body() data: UpdateHomeDto) {
    return this.adminService.updateHome(id, data);
  }
}
