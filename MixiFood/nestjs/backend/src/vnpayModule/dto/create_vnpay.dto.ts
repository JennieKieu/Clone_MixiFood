import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { plainToClassDto } from 'src/common/plainToClass.dto';

export class CreateVnPayDto extends plainToClassDto {
  @Expose()
  @IsNotEmpty()
  tmnCode: string;
  @Expose()
  @IsNotEmpty()
  secret: string;
}
