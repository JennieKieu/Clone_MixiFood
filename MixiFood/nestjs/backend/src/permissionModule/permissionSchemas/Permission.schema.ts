import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface PermissionDocument extends Document {
  permissionName: string;
  description: string;
}

export interface PermissionModel extends Model<PermissionDocument> {}

@Schema({})
export class Permission {
  @Prop({ required: true, type: String })
  permissionName: string;
  @Prop({ required: true, type: String })
  description: string;
}

export const permissionSchema = SchemaFactory.createForClass(Permission);
