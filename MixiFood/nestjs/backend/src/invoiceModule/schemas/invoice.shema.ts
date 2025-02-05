import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

export type TInvoiceStatus = 'pending' | 'cancel' | 'success';
export type TPaymentMethods = 'cash' | 'momo' | 'vnpay';

export interface InvoiceDocument extends Document {
  restaurantId: Types.ObjectId;
  orderId: Types.ObjectId;
  status: TInvoiceStatus;
  paymentMethod: TPaymentMethods;
  seatId: Types.ObjectId;
  employeeId: Types.ObjectId;
  userPhoneNumber?: string;
  totalPrice: number;
  vnpayUrl?: string;
  createdAt?: Date;
}

export interface InvoiceModel extends Model<InvoiceDocument> {}

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Seat', required: true })
  seatId: Types.ObjectId;
  @Prop({ type: String, default: 'pending' })
  status: TInvoiceStatus;
  @Prop({ type: String, required: true, enum: ['cash', 'momo', 'vnpay'] })
  paymentMethod: TPaymentMethods;
  @Prop({ type: String })
  userPhoneNumber: string;
  @Prop({ type: String })
  vnpayUrl: string;
  @Prop({ type: Number, required: true })
  totalPrice: number;
}

export const invoiceShema = SchemaFactory.createForClass(Invoice);
