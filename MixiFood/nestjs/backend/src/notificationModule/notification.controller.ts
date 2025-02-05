import { Body, Controller, Post } from '@nestjs/common';
import { NotificationDto } from './dto/Notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('Test')
  async testNotifi(@Body() dto: NotificationDto) {
    // return await this.notificationService.sendPaymentRequestNotification(dto);
  }
}
