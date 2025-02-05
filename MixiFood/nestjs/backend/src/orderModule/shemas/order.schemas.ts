import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

export type foodStatus =
  | 'pending'
  | 'serve'
  | 'complete'
  | 'cancel'
  | 'canceling';
export type orderStatus = 'serving' | 'complete' | 'payment';

export interface OrderDocument extends Document {
  // _id: Types.ObjectId;
  restaurantId: Types.ObjectId;
  foodItems: Array<{
    foodId: Types.ObjectId;
    quantity: number;
    status: foodStatus;
    orderTime: Date;
    employeeIds: Types.ObjectId;
    _id?: string;
  }>;
  employeeId: Types.ObjectId;
  seatId: Types.ObjectId;
  status: orderStatus;
}

export interface OrderModel extends Model<OrderDocument> {}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Restaurant' })
  restaurantId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, ref: 'Employee' })
  employeeId: Types.ObjectId;
  @Prop({
    type: [
      {
        foodId: Types.ObjectId,
        quantity: Number,
        status: { type: String, default: 'pending' },
        orderTime: { type: Date, default: Date.now },
        employeeIds: { type: Types.ObjectId, ref: 'Employee' },
      },
    ],
    required: true,
  })
  foodItems: { foodId: Types.ObjectId; quantity: number; status: foodStatus }[];
  @Prop({ type: Types.ObjectId, required: true, ref: 'seats' })
  seatId: Types.ObjectId;
  @Prop({ type: String, required: true, default: 'serving' })
  status: orderStatus;
}

export const orderSchema = SchemaFactory.createForClass(Order);
