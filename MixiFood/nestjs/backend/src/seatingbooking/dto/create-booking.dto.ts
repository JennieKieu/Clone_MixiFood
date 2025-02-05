import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { plainToClassDto } from 'src/common/plainToClass.dto';

export class CreateBookingDto extends plainToClassDto {
  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  restaurantId: string;
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  numberOfAdults: number;
  @Expose()
  numberOfChildren: number;
  @Expose()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date) // Chuyển đổi chuỗi JSON thành kiểu Date
  bookingTime: Date;
  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  seatingId: string;
  @Expose()
  @IsOptional()
  @IsString()
  notes?: string;
  // @Expose()
  // @IsNotEmpty()
  // contactPhoneNumber: string;
}
