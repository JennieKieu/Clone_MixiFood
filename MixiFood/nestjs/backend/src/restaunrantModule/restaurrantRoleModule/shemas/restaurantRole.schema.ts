import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employee } from 'src/EmployeeModule/schemas/employee.schema';
import { Permission } from 'src/permissionModule/permissionSchemas/Permission.schema';
import { RestaurantPermission } from 'src/restaunrantModule/restaurantPermissionModule/schemas/restaurantPermission.schem';
import { Restaurant } from 'src/restaunrantModule/schemas/restaurant.schema';

export enum ERestaurantRoleName {
  'admin' = 'admin',
  'serve' = 'serve',
  'manage' = 'manage',
  'security' = 'security',
  'chef' = 'chef',
}

export interface RestaurantRoleDocument extends Document {
  roleName: ERestaurantRoleName;
  restaurant: string;
  permissions: Permission[];
  employees: Types.ObjectId[];
}

export interface RestaurantRoleModel extends Model<RestaurantRoleDocument> {}

@Schema({})
export class RestaurantRole {
  @Prop({
    type: String,
    enum: ['admin', 'serve', 'security', 'manage', 'chef'],
    required: true,
  })
  roleName: ERestaurantRoleName;
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Restaurant;
  @Prop({ type: Types.ObjectId, ref: 'RestaurantPermission', default: [] })
  permissions: RestaurantPermission[];
  @Prop({ type: Types.ObjectId, ref: 'Employees', default: [] })
  employees: Types.ObjectId[];
}

export const RestaurantRoleSchema =
  SchemaFactory.createForClass(RestaurantRole);
