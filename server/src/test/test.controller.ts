import { PageParam } from '../dtos/page-params.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { TestService } from './test.service';
import { Controller, Get, Query } from '@nestjs/common';

@AuthGuard()
@Controller('api/v1/test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get('protected')
  @AuthGuard()
  getProtected() {
    return { message: 'Accessed!' };
  }

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
    // return this.testService.updateFilesTable();
    return this.testService.uploadData(user);
  }
}
