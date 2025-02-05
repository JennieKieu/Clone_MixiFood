import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

export type VnPayDocument = HydratedDocument<Vnpay>;

export interface VnpayModel extends Model<VnPayDocument> {}

@Schema({ timestamps: true })
export class Vnpay {
  @Prop({ type: String, required: true })
  tmnCode: string;
  @Prop({ type: String, required: true })
  secret: string;
}

export const vnPaySchema = SchemaFactory.createForClass(Vnpay);
