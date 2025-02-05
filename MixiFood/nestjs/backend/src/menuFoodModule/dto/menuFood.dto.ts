import { Expose, plainToClass } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { EMenuFood } from '../schemas/menuFood.types';

export class MenuFoodDto {
  @Expose()
  @IsNotEmpty()
  menuName: string;

  static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
