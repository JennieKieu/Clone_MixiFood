import { Expose, plainToClass } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class SeatDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  seatName: string;
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  maxOfPeople: number;
  restaurantId?: Types.ObjectId

  static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
