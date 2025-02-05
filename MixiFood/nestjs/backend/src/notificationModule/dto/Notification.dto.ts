import { Expose } from 'class-transformer';
import { IsNotEmpty, isNotEmpty } from 'class-validator';
import { plainToClassDto } from 'src/common/plainToClass.dto';

export class NotificationDto extends plainToClassDto {
  @Expose()
  @IsNotEmpty()
  token: string;
  @Expose()
  @IsNotEmpty()
  title: string;
  @Expose()
  @IsNotEmpty()
  body: string;
}
