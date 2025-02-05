import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto, UserType } from './userAuth/login-auth.dto';
import { UserService } from 'src/userModule/user.service';
import { JwtService } from '@nestjs/jwt';
import { RestaurantService } from 'src/restaunrantModule/restaurant.service';
import { UserDto } from 'src/userModule/user.dto';
import { RestaurantDto } from 'src/restaunrantModule/restaurant.dto';
import { TwilioService } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';
import { Length } from 'class-validator';
import { SmsAuthDto } from './userAuth/sms-auth.dto';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { STATUS_CODES } from 'http';
import { jwtPayload } from './jwt.strategy';
import { ERoleName } from 'src/roleModule/roleSchemas/Role.schema';
import multer from 'multer';
import { UploadService } from 'src/uploadModule/upload.service';
import { TUserUpload } from 'src/uploadModule/upload.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly restaurantService: RestaurantService,
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
    private readonly twilioService: TwilioService,
    private readonly configSecret: ConfigService,
    private readonly uploadService: UploadService,
  ) { }

  async login(dto: LoginAuthDto) {
    if (dto.userType === UserType.User) {
      const validateUser = await this.userService.validateUser(
        dto.phoneNumber,
        dto.password,
      );
      const token = await this.signJwtToken(
        validateUser._id.toString(),
        dto.userType,
      );
      if (!validateUser.isActived) {
        return {
          data: {
            token: token,
            success: false,
            user: validateUser,
            message: 'User is not actived',
          },
        };
      }

      return {
        message: 'user logged in successfully',
        data: {
          success: true,
          user: validateUser,
          token: token,
        },
      };
    } else if (dto.userType === UserType.Restaurant) {
      const loginType =
        await this.restaurantService.findRestaurantOrEmployeeByPhoneNumber(
          dto.phoneNumber,
        );
      if (loginType === UserType.Restaurant) {
        const validateRestaurant =
          await this.restaurantService.validateRestaurant(
            dto.phoneNumber,
            dto.password,
          );
        const token = await this.signJwtToken(
          validateRestaurant._id.toString(),
          dto.userType,
        );

        if (!validateRestaurant.isActived) {
          return {
            data: {
              token: token,
              success: false,
              user: validateRestaurant,
              message: 'Restaurant is not actived',
            },
          };
        }

        return {
          message: 'user logged in successfully',
          data: {
            success: true,
            user: validateRestaurant,
            token: token,
          },
        };
      } else if (loginType === UserType.Employee) {
        const validateEmployee = await this.employeeService.validateEmployee(
          dto.phoneNumber,
          dto.password,
        );

        const token = await this.signJwtToken(
          validateEmployee._id.toString(),
          UserType.Employee,
        );

        return {
          message: 'user logged in successfully',
          data: {
            success: true,
            user: validateEmployee,
            token: token,
          },
        };
      }
    } else {
      const validateEmployee = await this.userService.validateUser(
        dto.phoneNumber,
        dto.password,
      );
      const token = await this.signJwtToken(
        validateEmployee._id.toString(),
        dto.userType,
      );
      return {
        message: 'user logged in successfully',
        data: {
          restaurant: validateEmployee,
          token: token,
        },
      };
    }
  }

  async registerUser(dto: UserDto) {
    const smsOtp = this.generateOtp();
    const createdUser = await this.userService.createUser(dto, smsOtp);
    const token = await this.signJwtToken(
      createdUser._id.toString(),
      UserType.User,
    );

    return {
      message: 'User created successfuly',
      data: {
        success: true,
        user: createdUser,
        token: token,
      },
    };
  }

  async registerRestaurant(dto: RestaurantDto) {
    const smsOtp = this.generateOtp();

    const createRes = await this.restaurantService.createRestaurant(
      dto,
      smsOtp,
    );
    const token = await this.signJwtToken(
      createRes._id.toString(),
      UserType.Restaurant,
    );

    return {
      message: 'Restaurant created successfuly',
      data: {
        success: true,
        user: createRes,
        token: token,
      },
    };
  }

  async sendSMSOtp(dto: SmsAuthDto) {
    try {
      const user =
        dto.userType === UserType.User
          ? await this.userService.findOneByPhoneNumberSms(dto.phoneNumber)
          : await this.restaurantService.findOneByPhoneNumberSms(dto.phoneNumber);

      if (!user) {
        throw new NotFoundException('could not find user');
      }
      if (user.isActived) {
        return {
          success: true,
          message: 'Accout has verify',
        };
      }
      this.sendSMS((await user).phoneNumber, (await user).smsVerificationCode);

      return {
        success: true,
        message: 'Account send sms otp successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Twillio server error'
      }
    }
  }

  async verifyOtp(dto: SmsAuthDto) {
    const user =
      dto.userType === UserType.User
        ? await this.userService.findOneByPhoneNumberSms(dto.phoneNumber)
        : await this.restaurantService.findOneByPhoneNumberSms(dto.phoneNumber);

    if (!user) {
      throw new NotFoundException('could not find user');
    }

    if ((await user).isActived) {
      return {
        data: {
          success: true,
          message: 'Account has verified',
        },
      };
    }

    if ((await user).smsVerificationCode === dto.smsOtp) {
      (await user).isActived = true;
      (await user).save();
      return {
        data: {
          success: true,
          message: 'Account verified successfully',
        },
      };
    } else {
      return {
        data: {
          success: false,
          message: 'Invalid OTP',
        },
      };
    }
  }

  private async sendSMS(phoneNumber: string, otp: string) {
    this.twilioService.client.messages.create({
      body: `Đây là mã xác thực MIXIFOOD của bạn ${otp}`,
      from: this.configSecret.get('TWILIO_PHONENUMBER'),
      // to: '+84339122327',
      to: `+${phoneNumber.startsWith('0') ? phoneNumber.replace('0', '84') : phoneNumber}`,
    });
  }

  private generateOtp() {
    return `${10000 + Math.floor(100000 + Math.random() * 900000)}`;
  }

  private async signJwtToken(userId: string, userType: string) {
    return this.jwtService.signAsync({ sub: userId, userType: userType });
  }

  async verifyToken(token: string) {
    try {
      const decoded: jwtPayload = this.jwtService.verify(token);
      const user =
        decoded.userType === UserType.User
          ? await this.userService.findOneById(decoded.sub)
          : await this.restaurantService.findOneById(decoded.sub);
      if (!user) throw new NotFoundException('User not found');
      else {
        if (user.isActived) {
          return {
            success: true,
            user,
            userType: decoded.userType,
          };
        } else {
          return {
            success: false,
            message: `${decoded.userType} is not activated. Please activate your account.`,
            isActive: false,
            phonumber: user.phoneNumber,
            UserType,
          };
        }
      }
      // const user = await this.userService.findOneById(decoded.)
    } catch (error) {
      if (error.name === 'TokenExpiredError')
        throw new UnauthorizedException('Token has expired');
      throw new UnauthorizedException('Invalid token');
    }
  }

  // upload avatar
  async uploadAvatar(
    userRole: ERoleName,
    userId: string,
    uploadType: TUserUpload,
    avatar: Express.Multer.File,
  ) {
    const user =
      userRole === ERoleName.user
        ? await this.userService.findOneById(userId)
        : userRole === ERoleName.restaurant
          ? await this.restaurantService.findOneById(userId)
          : await this.employeeService.findOneById(userId);
    const upload = await this.uploadService.updateAvatar(avatar);

    if (uploadType === 'avatar') {
      user.avatar = upload.url;
      await user.save();
    } else if (uploadType === 'coverImage') {
      user.coverImage = upload.url;
      await user.save();
    }

    return {
      data: {
        success: true,
        data: user,
      },
    };
  }
}
