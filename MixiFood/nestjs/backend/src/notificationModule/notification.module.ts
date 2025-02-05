import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PushNotification,
  pushNotificationSchema,
} from './schemas/PushNotification';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PushNotification.name, schema: pushNotificationSchema },
    ]),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
