import { All, Controller, NotFoundException } from '@nestjs/common';

@Controller('/api/v1/*')
export class NotFoundController {

  @All()
  notfound() {
    throw new NotFoundException();
  }
}
