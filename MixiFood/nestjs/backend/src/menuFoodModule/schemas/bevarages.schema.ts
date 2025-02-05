import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface BeverageDocument extends Document {
  name: string;
  price: number;
}
export interface FoodModel extends Model<BeverageDocument> {}

@Schema({ timestamps: true })
export class Beverage {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: Boolean, required: true, default: true })
  available: boolean;
  //   @Prop({ type: String, required: true })
}

export const BeverageSchema = SchemaFactory.createForClass(Beverage);
