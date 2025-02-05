import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Length,
  MinLength,
} from 'class-validator';
import { UserType } from 'src/auth/userAuth/login-auth.dto';
import { BaseDto } from 'src/common/base.dto';

export class UserDto extends BaseDto {
  @IsNotEmpty()
  @Expose()
  @Length(10)
  phoneNumber: string;
  @IsNotEmpty()
  @Expose()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Expose()
  userName: string;

  @IsNotEmpty()
  @MinLength(8)
  @Expose()
  password: string;
}
