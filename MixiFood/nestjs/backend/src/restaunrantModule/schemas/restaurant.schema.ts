import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from 'src/roleModule/roleSchemas/Role.schema';
import * as bcrypt from 'bcrypt';
import { MenuFood } from 'src/menuFoodModule/schemas/menuFood.schema';
import { TOpenTimeOfDay } from 'src/locationModule/schemas/location.schema';
import { TAddPaymentMethodType } from 'src/paymentMethodModule/schemas/paymentMethod.shema';

export interface RestaurantDocument extends Document {
  _id?: Types.ObjectId;
  restaurantName: string;
  restaurantAddress: string;
  role: Role['roleName'];
  password: string;
  email: string;
  phoneNumber: string;
  isDeposit: boolean;
  timeRevokeToken: Date;
  smsVerificationCode: string;
  isActived: boolean;
  menus: Types.ObjectId[];
  restaurantRoles: Types.ObjectId[];
  avatar: string;
  coverImage: string;
  fcmToken?: string;
  locationId?: Types.ObjectId;
  openTimeOfDay?: TOpenTimeOfDay;
  paymentMethods?: {
    paymentMethodId: Types.ObjectId;
    paymentMethodName: string;
  }[];
  comparePassword(password: string): Promise<boolean>;
}

export interface RestaurantModel extends Model<RestaurantDocument> {
  isThisPhoneUser(phoneNumber: string): Promise<boolean>;
  isThisEmailUser(email: string): Promise<boolean>;
}

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ unique: true, required: true, type: String })
  phoneNumber: string;
  @Prop({ unique: true, required: true, type: String })
  email: string;
  @Prop({ required: true, type: String })
  restaurantName: string;
  @Prop({ required: true, type: String })
  restaurantAddress: string;
  @Prop({ type: Types.ObjectId, ref: 'Role', default: 'null' })
  role: Role;
  @Prop({ type: Date, default: new Date() })
  timeRevokeToken: Date;
  @Prop({ required: true, type: String, select: false })
  password: string;
  @Prop({ type: String, select: false })
  smsVerificationCode: string;
  @Prop({ type: Boolean, default: false })
  isActived: boolean;
  @Prop({
    required: false,
    default: 'https://i.stack.imgur.com/l60Hf.png',
    type: String,
  })
  avatar: string;
  @Prop({
    type: String,
    default: function () {
      const images = [
        'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/coverImageDefault.png',
        'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/defaultCoverImage2.png',
      ];
      return images[Math.floor(Math.random() * images.length)];
    },
  })
  coverImage: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Menu' }], default: [] })
  menus: Types.ObjectId[];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'RestaurantRole' }] })
  restaurantRoles: Types.ObjectId[];
  @Prop({ type: String })
  fcmToken: string;
  @Prop({ type: Types.ObjectId })
  locationId: Types.ObjectId;
  @Prop({
    type: {
      timeOpen: { type: String }, // 08:00
      timeClose: { type: String },
    },
    ref: 'Location',
  })
  openTimeOfDay: TOpenTimeOfDay;
  @Prop({
    type: [
      {
        paymentMethodId: { type: Types.ObjectId, ref: 'PaymentMethod' },
        paymentMethodName: { type: String },
      },
    ],
  })
  paymentMethods: {
    paymentMethodId: Types.ObjectId;
    paymentMethodName: string;
  }[];
}

export const restaurantSchema = SchemaFactory.createForClass(Restaurant);

restaurantSchema.pre('save', async function (next) {
  // const restaurant = this;
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

restaurantSchema.methods.comparePassword = async function (password: string) {
  if (!password) throw new Error('Password is missing, can not compare!');
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error while comparing password!', error.message);
  }
};

restaurantSchema.statics.isThisPhoneUser = async function (
  phoneNumber: string,
) {
  try {
    const restaurant = await this.findOne({ phoneNumber: phoneNumber });
    if (restaurant) return false;
    return true;
  } catch (error) {
    console.log('error inside isThis phone in use method', error.message);
    return false;
  }
};

restaurantSchema.statics.isThisEmailUser = async function (email: string) {
  try {
    const restaurant = await this.findOne({ email: email });
    if (restaurant) return false;
    return true;
  } catch (error) {
    console.log('error inside isThis phone in use method', error.message);
    return false;
  }
};
