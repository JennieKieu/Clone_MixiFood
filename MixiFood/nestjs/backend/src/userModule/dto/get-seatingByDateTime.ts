import { Expose } from 'class-transformer';
import { IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';
import { plainToClassDto } from 'src/common/plainToClass.dto';

export class GetSeatingByDateTimeDto extends plainToClassDto {
  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  restaurantId: string;

  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  seatId: string;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  dateTime: string; // Dạng "YYYY-MM-DDTHH:mm:ss" (ISO 8601)
}
