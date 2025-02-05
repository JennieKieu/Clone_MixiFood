import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

export type TSeatingBookingStatus =
  | 'pending'
  | 'cancel'
  | 'payment'
  | 'success';
export enum ESeatingBookingStatus {
  'pending' = 'pending',
  'cancel' = 'cancel',
  'payment' = 'payment',
  'success' = 'success',
}

// export interface SeatingBookingDocument extends Document {
//   userId: Types.ObjectId;
//   restaurantId: Types.ObjectId;
//   // branch?
//   numberOfPeople: number;
//   bookingTime: Date;
//   status: TSeatingBookingStatus;
//   seatingId: Types.ObjectId;
//   notes?: string;
//   contactPhoneNumber: string;
//   bookingExpiresAt: Date;
// }

export type SeatingBookingDocument = HydratedDocument<SeatingBooking>;

export interface SeatingBookingModel extends Model<SeatingBookingDocument> {}

@Schema({ timestamps: true })
export class SeatingBooking {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, ref: 'Restaurant' })
  restaurantId: Types.ObjectId;
  @Prop({ type: Number, required: true, default: 2 })
  numberOfAdults: number;
  @Prop({ type: Number, default: 0 })
  numberOfChildren: number;
  @Prop({
    type: String,
    enum: ESeatingBookingStatus,
    default: 'pending',
  })
  status: ESeatingBookingStatus;
  @Prop({ type: Types.ObjectId, required: true, ref: 'Seating' })
  seatingId: Types.ObjectId;
  @Prop({ type: String, required: true })
  seatingName: string;
  @Prop({ type: Date, required: true })
  bookingTime: Date;
  @Prop({ type: String })
  notes: string;
  @Prop({ type: String, required: true })
  contactPhoneNumber: string;
  @Prop({ type: Date, default: null })
  bookingExpiresAt: Date;
}

export const seatingBookingSchema =
  SchemaFactory.createForClass(SeatingBooking);

seatingBookingSchema.pre<SeatingBookingDocument>('save', function (next) {
  if (this.isNew) {
    // this.bookingExpiresAt = new Date(Date.now() + 10 * 60 * 1000); //10 minute
    this.bookingExpiresAt = new Date(Date.now() + 30 * 60 * 1000); //5 minute
    // Test 1 minutes
    // this.bookingExpiresAt = new Date(Date.now() + 1 * 60 * 1000); //1 minute
  }
  next();
});
