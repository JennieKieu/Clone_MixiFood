import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

// export interface SeatDocument extends Document {
//   seatName: string;
//   maxOfPeople: number;
//   isBooking: boolean;
//   isSelect: boolean;
//   restaurantId: Types.ObjectId;
//   description: string;
//   image: string;
//   isServing: boolean;
//   currentOrderId: Types.ObjectId;
// }

export enum ESeatingStatus {
  'ready' = 'ready',
  'serving' = 'serving',
  'paying' = 'paying',
  'booking' = 'booking',
}

export type SeatDocument = HydratedDocument<Seat>;

export interface SeatModel extends Model<SeatDocument> {}

@Schema({ timestamps: true })
export class Seat {
  @Prop({ type: String })
  seatName: string;
  @Prop({ type: Number, default: 2 })
  maxOfPeople: number;
  @Prop({ type: Boolean, default: false })
  isBooking: boolean;
  @Prop({ type: Boolean, default: false })
  isSelect: boolean;
  @Prop({ ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String })
  image: string;
  @Prop({ type: Boolean, required: true, default: false })
  isServing: boolean;
  @Prop({ type: Types.ObjectId, default: null })
  currentOrderId: Types.ObjectId;
  @Prop({ type: [{ date: { type: Date } }], default: [] })
  bookingTime: Array<{ date: Date }>;
  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, required: true },
        createdAt: { type: Date, default: Date.now },
        selectedTime: { type: Date, required: true },
        expireTime: { type: Date, required: true },
      },
    ],
    default: [],
  })
  isSelectByBooking: Array<{
    userId: Types.ObjectId;
    createdAt: Date;
    selectedTime: Date;
    expireTime: Date;
  }>;
  @Prop({ type: Boolean, default: false })
  isDelete: boolean;
  @Prop({ type: String, enum: ESeatingStatus, default: ESeatingStatus.ready })
  status: ESeatingStatus;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);

SeatSchema.pre<SeatDocument>('save', function (next) {
  if (this.isSelectByBooking && this.isSelectByBooking.length > 0) {
    this.isSelectByBooking.forEach((selection) => {
      selection.expireTime = new Date(
        selection.selectedTime.getTime() + 5 * 60000,
      );
    });
  }
  next();
});
