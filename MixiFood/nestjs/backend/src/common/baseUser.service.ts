import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

interface CommonUserFiels {
  phoneNumber: string;
  email: string;
}

export class BaseUserService<T extends Document & CommonUserFiels> {
  constructor(private readonly model: Model<T>) {}

  async findOneById(id: string) {
    try {
      const entity = await this.model.findById(id).exec();
      if (!entity) {
        throw new NotFoundException('Could not find entity.');
      }
      return entity;
    } catch (error) {
      
    }
   
  }

  async findOneByPhoneNumber(phoneNumber: string) {
    const user = await this.model.findOne({ phoneNumber: phoneNumber }).exec();
    if (!user) {
      throw new NotFoundException('could not find user');
    }
    return user;
  }

  async findOneByPhoneNumberSms(phoneNumber: string) {
    const user = await await this.model
      .findOne({ phoneNumber: phoneNumber })
      .select('+smsVerificationCode')
      .exec();
    if (!user) {
      throw new NotFoundException('could not find user');
    }
    return user;
  }

  async updateAvatar(userId: string, avatarUrl) {
    const user = await this.model.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // user.ava
    return user;
  }
}
