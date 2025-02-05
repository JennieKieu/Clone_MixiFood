import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { plainToClassDto } from 'src/common/plainToClass.dto';

export class Get_confirmPaymentDto extends plainToClassDto {
  @Expose()
  @IsNotEmpty()
  invoiceId: string;
}
