import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Restaurant } from 'src/restaunrantModule/schemas/restaurant.schema';

export interface RestaurantPermissionDocument extends Document {
  permissionName: string;
  restaurant: Restaurant;
  description: string;
}

export interface RestaurantPermissionModel
  extends Model<RestaurantPermissionDocument> {}

@Schema({})
export class RestaurantPermission {
  @Prop({ required: true, type: String })
  permissionName: string;
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Restaurant;
  @Prop({ required: true, type: String })
  description: string;
}

export const restaurantPermissionSchema =
  SchemaFactory.createForClass(RestaurantPermission);
