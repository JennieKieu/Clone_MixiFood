import * as bcrypt from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import {
  ERestaurantRoleName,
  RestaurantRole,
} from 'src/restaunrantModule/restaurrantRoleModule/shemas/restaurantRole.schema';
import { Restaurant } from 'src/restaunrantModule/schemas/restaurant.schema';
import { ERoleName, Role } from 'src/roleModule/roleSchemas/Role.schema';

export interface EmployeeDocument extends Document {
  fullName: string;
  age: number;
  restaurant: Restaurant;
  phoneNumber: string;
  isFullTime: boolean;
  avatar: string;
  coverImage: string;
  password: string;
  restaurantRole: RestaurantRole;
  role: Role;
  isActive: boolean;
  email: string;
  comparePassword(passport: string): Promise<boolean>;
}

export interface EmployeeModel extends Model<EmployeeDocument> {
  isThisPhoneUser(phoneNumber: string): Promise<boolean>;
}

@Schema({ timestamps: true })
export class Employee {
  @Prop({ type: String, required: true })
  fullName: string;
  @Prop({ type: String, required: true, unique: true })
  phoneNumber: string;
  @Prop({ type: Types.ObjectId, ref: 'Restaurant' })
  restaurant: Restaurant;
  @Prop({ type: Boolean, required: true, default: false })
  isFullTime: boolean;
  @Prop({ type: String, required: true })
  password: string;
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
  @Prop({ type: Types.ObjectId, ref: 'Role', default: ERoleName.employee })
  role: Role;
  @Prop({
    type: Types.ObjectId,
    ref: 'RestaurantRole',
    default: ERestaurantRoleName.serve,
  })
  restaurantRole: RestaurantRole;
  @Prop({ type: Boolean, default: true })
  isActive: boolean;
  @Prop({ type: String })
  email: string;
}

export const employeeSchema = SchemaFactory.createForClass(Employee);

employeeSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

employeeSchema.pre(['findOneAndUpdate'], async function (next) {
  const update = this.getUpdate() as UpdateQuery<EmployeeDocument>;

  if (update && update.$set.password) {
    update.$set.password = await bcrypt.hash(update.$set.password, 10);
  }

  next();
});

employeeSchema.methods.comparePassword = async function (password: string) {
  if (!password) throw new Error('Password is missing, can not compare!');
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error while comparing password!', error.message);
  }
};

employeeSchema.statics.isThisPhoneUser = async function (phoneNumber: string) {
  try {
    const employee = await this.findOne({ phoneNumber: phoneNumber });
    if (employee) return false;
    return true;
  } catch (error) {
    console.log('error inside isThis phone in use method', error.message);
    return false;
  }
};
