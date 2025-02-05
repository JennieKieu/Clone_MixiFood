import * as bcrypt from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Mongoose, Types } from 'mongoose';
import { Role } from 'src/roleModule/roleSchemas/Role.schema';
import { IUser } from '../interfaces/user.interface';

// export type UserDocument = User & Document;
export interface UserDocument extends Document {
  phoneNumber: string;
  email: string;
  userName: string;
  password: string;
  avatar: string;
  coverImage: string;
  gender: string;
  isAdmin: boolean;
  dateOfBirth: string;
  isActived: boolean;
  timeRevokeToken: Date;
  role: Role;
  smsVerificationCode: string;
  comparePassword(password: string): Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {
  isThisPhoneUser(phoneNumber: string): Promise<boolean>;
  isThisEmailUser(email: string): Promise<boolean>;
  findOneByPhoneNumber(phoneNumber: string);
}

export type catDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true, type: String })
  phoneNumber: string;
  @Prop({ unique: true, required: true, type: String })
  email: string;
  @Prop({ required: true, type: String })
  userName: string;
  @Prop({ required: true, select: false })
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
  @Prop({ type: String })
  gender: string;

  @Prop({ type: Boolean, required: true, default: false })
  isAdmin: boolean;
  @Prop({ required: false, type: String })
  dateOfBirth: string;
  @Prop({ type: Boolean, default: false })
  isActived: boolean;
  @Prop({ type: Date, default: new Date() })
  timeRevokeToken: Date;
  @Prop({ type: String, select: false })
  smsVerificationCode: string;
  @Prop({ type: Types.ObjectId, ref: 'Role', default: null })
  role: Role;
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.pre('save', async function (next) {
  // const user = this;
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  if (!password) throw new Error('Password is missing, can not compare!');
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error while comparing password!', error.message);
  }
};

userSchema.statics.isThisPhoneUser = async function (phoneNumber: string) {
  try {
    const user = await this.findOne({ phoneNumber: phoneNumber });
    if (user) return false;
    return true;
  } catch (error) {
    console.log('error inside isThis phone in use method', error.message);
    return false;
  }
};

userSchema.statics.isThisEmailUser = async function (email: string) {
  try {
    const user = await this.findOne({ email: email });
    if (user) return false;
    return true;
  } catch (error) {
    console.log('error inside isThis phone in use method', error.message);
    return false;
  }
};

userSchema.statics.findOneByPhoneNumber = async function (phoneNumber) {
  try {
    const user = await this.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {}
};
