import { Expose, plainToClass } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, Length } from 'class-validator';

export class RemoveFoodDto {
  @Expose()
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  foodIds: string[];

  static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
