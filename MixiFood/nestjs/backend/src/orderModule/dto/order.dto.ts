import { Expose, plainToClass, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

class FoodItemDto {
  @Expose()
  @IsNotEmpty()
  foodId: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class OrderDto {
  @Expose()
  @IsNotEmpty()
  seatId: string;
  @IsArray()
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => FoodItemDto)
  foodItems: FoodItemDto[];

  static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
