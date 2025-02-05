import { Expose, plainToClass } from 'class-transformer';
import { MenuFoodDto } from './menuFood.dto';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

// export class FoodDto extends MenuFoodDto {
//   constructor() {
//     super();
//   }
// }

export class FoodDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;
  @Expose()
  // @IsNumber()
  @IsNotEmpty()
  price: string;
  @Expose()
  @IsNotEmpty()
  @IsString()
  unit: string;
  @Expose()
  isRemoveBg?: string;
  // @Expose()
  // available?: boolean;

  static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}

export class EditFoodDto extends FoodDto {
  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  foodId: string;
}
