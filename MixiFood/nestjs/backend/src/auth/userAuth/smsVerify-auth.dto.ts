import { Expose, plainToClass } from 'class-transformer';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { UserType } from './login-auth.dto';

export class SmsVerifyAuthDto {
  @Expose()
  @Length(10)
  @IsNotEmpty()
  phoneNumber: string;
  @Expose()
  @Length(6)
  @IsNotEmpty()
  smsOtp: string;
  @Expose()
  @IsNotEmpty()
  @IsEnum(UserType, {
    message: 'userType must be either "user" or "restaurant"',
  })
  userType: UserType;
  static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
