import { Expose, plainToClass } from 'class-transformer';
import { IsEnum, IsNotEmpty, Length, MinLength } from 'class-validator';
export enum UserType {
  User = 'user',
  Restaurant = 'restaurant',
  Employee = 'Employee',
}
export class LoginAuthDto {
  @IsNotEmpty()
  @Length(10)
  @Expose()
  phoneNumber: string;
  @IsNotEmpty()
  @MinLength(8)
  @Expose()
  password: string;
  @Expose()
  @IsNotEmpty()
  @IsEnum(UserType, {
    message: 'userType must be either "user" or "restaurant"',
  })
  userType: string;

  static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
