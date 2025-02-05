import { Expose, plainToClass } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { BaseDto } from 'src/common/base.dto';

export class RestaurantDto extends BaseDto {
  @Expose()
  @Length(10)
  @IsNotEmpty()
  phoneNumber: string;
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @Expose()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
  @Expose()
  @IsNotEmpty()
  restaurantAddress: string;
  @Expose()
  @IsNotEmpty()
  @IsString()
  restaurantName: string;

  static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
