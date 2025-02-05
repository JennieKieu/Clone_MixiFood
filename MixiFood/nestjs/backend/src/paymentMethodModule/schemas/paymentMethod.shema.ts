import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

export type TAddPaymentMethodType = 'momo' | 'vnpay';

export type PaymentMethodDocument = HydratedDocument<PaymentMethod>;

export interface PaymentMethodModel extends Model<PaymentMethodDocument> {}

@Schema({ timestamps: true })
export class PaymentMethod {
  @Prop({ type: Types.ObjectId, require: true, ref: 'Restaurant' })
  restaurantId: Types.ObjectId;
  @Prop({ type: String, required: true, enum: ['momo', 'vnpay'] })
  paymentMethodName: TAddPaymentMethodType;
  @Prop({ type: Boolean, default: false })
  isDelete: boolean;
  @Prop({ type: Types.ObjectId, required: true })
  paymentId: Types.ObjectId;
}

export const paymentMethodShema = SchemaFactory.createForClass(PaymentMethod);
