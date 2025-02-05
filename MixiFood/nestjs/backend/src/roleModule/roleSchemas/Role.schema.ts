import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Permission } from 'src/permissionModule/permissionSchemas/Permission.schema';

export enum ERoleName {
  'user' = 'user',
  'restaurant' = 'restaurant',
  'admin' = 'admin',
  'employee' = 'employee',
}

export interface RoleDocument extends Document {
  roleName: ERoleName;
  permissions: Permission[];
}

export interface RoleModel extends Model<RoleDocument> {}

@Schema({})
export class Role {
  @Prop({ type: String, enum: ['user', 'restaurant', 'admin', 'employee'], required: true })
  roleName: ERoleName;
  @Prop({ type: Types.ObjectId, ref: 'Permission' })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
