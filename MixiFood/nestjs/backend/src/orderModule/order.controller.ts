import { Controller, Get } from '@nestjs/common';

@Controller('order')
export class OrderController {
  constructor() {}

  @Get('test')
  test() {
    return 'heelo';
  }
}
