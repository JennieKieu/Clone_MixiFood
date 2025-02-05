import { Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class BaseRestaurantDto {
  @Expose()
  @IsNotEmpty()
  static readonly restaurantName: string;
  @Expose()
  @IsNotEmpty()
  restaurantaddress: string;
  @IsNotEmpty()
  @Expose()
  password: string;
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
