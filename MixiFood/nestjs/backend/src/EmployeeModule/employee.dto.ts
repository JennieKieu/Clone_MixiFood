import { Expose, plainToClass } from 'class-transformer';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { plainToClassDto } from 'src/common/plainToClass.dto';
import { ERestaurantRoleName } from 'src/restaunrantModule/restaurrantRoleModule/shemas/restaurantRole.schema';

export class EmployeeDto {
  @Expose()
  @IsNotEmpty()
  fullName: string;
  @Expose()
  @IsNotEmpty()
  @Length(10)
  phoneNumber: string;
  @IsNotEmpty()
  @Expose()
  password: string;
  //   @IsNotEmpty()
  //   restaurant: string;
  @Expose()
  @IsNotEmpty()
  @IsEnum(ERestaurantRoleName)
  restaurantRole?: ERestaurantRoleName;

  @Expose()
  isFullTime: boolean;

  static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}

export class EditEmployeeDto extends plainToClassDto {
  @Expose()
  @IsNotEmpty()
  fullName: string;
  // @IsNotEmpty()
  @Expose()
  password?: string;
  //   @IsNotEmpty()
  //   restaurant: string;
  @Expose()
  @IsNotEmpty()
  @IsEnum(ERestaurantRoleName)
  restaurantRole?: ERestaurantRoleName;

  @Expose()
  isFullTime: boolean;
}
