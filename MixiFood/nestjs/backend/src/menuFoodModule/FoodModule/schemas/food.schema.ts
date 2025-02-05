import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

export interface FoodDocument extends Document {
  name: string;
  price: number;
  available: boolean;
  restaurantId: Types.ObjectId;
  foodImage: string;
  isRemoveBg: boolean;
  isDelete: boolean;
  unit: string;
}

// export type FoodDocument = HydratedDocument<Food>;

export interface FoodModel extends Model<FoodDocument> {}

@Schema({ timestamps: true })
export class Food {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: Number, required: true })
  price: string;
  @Prop({ type: Boolean, required: true, default: true })
  available: boolean;
  @Prop({ type: Types.ObjectId, required: true, ref: 'Restaurant' })
  restaurantId: Types.ObjectId;
  @Prop({ type: String })
  foodImage: string;
  @Prop({ type: Boolean })
  isRemoveBg: boolean;
  @Prop({ type: Boolean, default: false })
  isDelete: boolean;
  @Prop({ type: String, default: '' })
  unit: string;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
