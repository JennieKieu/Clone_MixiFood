import { Model, Types } from 'mongoose';
import { Restaurant } from 'src/restaunrantModule/schemas/restaurant.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EMenuFood } from './menuFood.types';
import { Food } from '../FoodModule/schemas/food.schema';
import { Beverage } from './bevarages.schema';

export interface MenuFoodDocument extends Document {
  restaurant: Restaurant;
  menuName: string;
  foods: Food[];
  beverages: Beverage[];
}

export interface MenuFoodModel extends Model<MenuFoodDocument> {}

@Schema({ timestamps: true })
export class MenuFood {
  @Prop({ type: String, required: true })
  menuName: string;
  @Prop({ type: Types.ObjectId, ref: 'Food', default: [] })
  foods: Food[];
  @Prop({ type: Types.ObjectId, ref: 'Beverage', default: [] })
  beverages: Beverage[];
}

export const MenuFoodSchema = SchemaFactory.createForClass(MenuFood);
