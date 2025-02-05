import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument, UserModel } from './schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './user.dto';
import {
  ERoleName,
  Role,
  RoleModel,
} from 'src/roleModule/roleSchemas/Role.schema';
import { TwilioService } from 'nestjs-twilio';
import { BaseUserService } from 'src/common/baseUser.service';
import { Document, Types } from 'mongoose';
import { RestaurantService } from 'src/restaunrantModule/restaurant.service';
import { GetSeatingByDateTimeDto } from './dto/get-seatingByDateTime';
import { SeatService } from 'src/seatModule/seat.service';

@Injectable()
export class UserService extends BaseUserService<UserDocument> {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    @InjectModel(Role.name) private roleModel: RoleModel,
    private readonly restaurantService: RestaurantService,
    private readonly seatService: SeatService,
  ) {
    super(userModel);
  }

  createUser = async (user: UserDto, smsOtp: string) => {
    // await this.sendSMS();
    if (!(await this.userModel.isThisPhoneUser(user.phoneNumber))) {
      throw new ConflictException('Phone number already exists');
    } else if (!(await this.userModel.isThisEmailUser(user.email))) {
      throw new NotFoundException('email already exists');
    }
    const newUser = new this.userModel({
      ...user,
      role: ERoleName.user,
      smsVerificationCode: smsOtp,
    });
    return newUser.save();
  };

  async validateUser(phoneNumber: string, password: string) {
    const user = await this.userModel
      .findOne({ phoneNumber })
      .select('+password')
      .exec();
    if (!user) {
      throw new NotFoundException('could not find user.');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new ConflictException('incorrect password');
    }
    return user;
  }

  // async findOneById(id: string) {
  //   const user = await this.userModel.findById(id).exec();
  //   if (!user) {
  //     throw new NotFoundException('could not find user');
  //   }
  //   return user;
  // }

  // async findOneByPhoneNumber(phoneNumber: string) {
  //   const user = await this.userModel
  //     .findOne({ phoneNumber: phoneNumber })
  //     .exec();
  //   if (!user) {
  //     throw new NotFoundException('could not find user');
  //   }
  //   return user;
  // }

  async smsOtpSave(id: string, otp: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('could not find user');
    }
    user.smsVerificationCode = otp;
  }

  // get restaurant public infomation
  async getRestaurantInfomation(restaurantId: string) {
    const restaurant =
      await this.restaurantService.getPublicInfomation(restaurantId);
    return {
      data: {
        success: true,
        restaurant,
      },
    };
  }

  // select seating
  async selectSeating(userId: Types.ObjectId, dto: GetSeatingByDateTimeDto) {
    // const seat = await this.seatService.selectSeating(userId, dto);
    const { seat, removed } = await this.seatService.selectSeating(userId, dto);

    return {
      success: true,
      seat,
      removed,
    };
  }
}
