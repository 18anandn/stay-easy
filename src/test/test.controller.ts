import { PageParam } from '../dtos/page-params.dto';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { TestService } from './test.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('api/v1/test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get('create')
  createData() {
    return this.testService.createData();
  }

  @Get('fakeData')
  getFakeData(@Query() { page }: PageParam) {
    return this.testService.getFakeData(page);
  }

  @Get('uploadData')
  uploadData(@CurrentUser() user: CurrentUserDto) {
    return this.testService.uploadData(user);
  }
}
