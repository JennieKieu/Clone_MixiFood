import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { NotificationDto } from './dto/Notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  PushNotificationModel,
  PushNotification,
} from './schemas/PushNotification';
import { Types } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(PushNotification.name)
    readonly pushNotificationModel: PushNotificationModel,
  ) {}
  // success
  async sendNotification(dto: NotificationDto) {
    try {
      const response = admin.messaging().send({
        token: dto.token,
        notification: {
          title: 'testđazxc',
          body: 'test',
        },
      });
      return await response;
    } catch (error) {
      console.log('err', error);

      throw error;
    }
  }

  async sendPaymentRequestNotification(
    dto: NotificationDto,
    restaurantId: Types.ObjectId,
  ) {
    try {
      const fcmToken = await this.pushNotificationModel.findOne({
        restaurantId: restaurantId,
      });

      const response = admin.messaging().send({
        token: fcmToken.fcmToken,
        notification: {
          title: dto.title,
          body: dto.body,
          // imageUrl:
          //   'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-meme-meo-15.jpg',
        },
      });
      return await response;
    } catch (error) {}
  }

  // booking
  async sendRequestBookingNotification(dto: NotificationDto) {
    try {
      const response = admin.messaging().send({
        token: dto.token,
        notification: {
          title: dto.title,
          body: dto.body,
          // imageUrl:
          //   'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-meme-meo-15.jpg',
        },
      });
      return await response;
    } catch (error) {}
  }

  // auto canncel booking
  async sendSystemCancelBookingNotification(dto: NotificationDto) {}

  // create and update fcmToken
  async createOrUpdateFcmToken(restaurantId: Types.ObjectId, fcmToken: string) {
    const notification = await this.pushNotificationModel.findOne({
      restaurantId: restaurantId,
    });
    if (!notification) {
      const newNotification = await new this.pushNotificationModel({
        restaurantId: restaurantId,
        fcmToken: fcmToken,
      });
      if ((notification.fcmToken = fcmToken))
        newNotification.fcmToken = fcmToken;
      return newNotification.save();
    }

    notification.fcmToken = fcmToken;
    return notification.save();
  }

  // get fcmToken
  async getFcmToken(restaurantId: Types.ObjectId) {
    try {
      const notification = await this.pushNotificationModel.findOne({
        restaurantId: restaurantId,
      });
  
      return notification.fcmToken || '';
    } catch (error) {
      return '';
    }
   
  }
}
