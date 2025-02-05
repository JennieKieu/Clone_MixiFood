import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

export type TDirection = {
  longitude: number;
  latitude: number;
};

export type TOpenTimeOfDay = {
  timeOpen: string; // HH:mm
  timeClose: string;
};

export interface LocationDocument extends Document {
  restaurantId: Types.ObjectId;
  direction: TDirection;
  directionName: string;
  openTimeOfDay: TOpenTimeOfDay;
  full_address: string;
  directionAvatar: string;
  isDelete: boolean;
}

export interface LocationModel extends Model<LocationDocument> {}

@Schema({ timestamps: true })
export class Location {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'Restaurant',
  })
  restaurantId: Types.ObjectId;
  @Prop({
    type: {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
    },
    required: true,
  })
  direction: TDirection;
  @Prop({ type: String, required: true })
  directionName: string;
  @Prop({
    type: {
      timeOpen: { type: String }, // 08:00
      timeClose: { type: String },
    },
  })
  openTimeOfDay: TOpenTimeOfDay;
  @Prop({ type: String })
  directionAvatar: string;
  @Prop({ type: String })
  full_address: string;
  @Prop({ type: Boolean, default: false })
  isDelete: boolean;
}

export const locationShema = SchemaFactory.createForClass(Location);
