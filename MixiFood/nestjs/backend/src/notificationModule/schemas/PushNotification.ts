import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

export type PushNotificationDocument = HydratedDocument<PushNotification>;

export interface PushNotificationModel
  extends Model<PushNotificationDocument> {}

@Schema({ timestamps: true })
export class PushNotification {
  @Prop({ type: Types.ObjectId, required: true, unique: true })
  restaurantId: Types.ObjectId;
  @Prop({ type: String, required: true })
  fcmToken?: string;
}

export const pushNotificationSchema =
  SchemaFactory.createForClass(PushNotification);
