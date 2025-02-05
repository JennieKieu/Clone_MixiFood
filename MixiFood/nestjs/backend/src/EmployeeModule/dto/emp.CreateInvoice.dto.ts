import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { plainToClassDto } from 'src/common/plainToClass.dto';
import { TPaymentMethods } from 'src/invoiceModule/schemas/invoice.shema';

export class EmpCreateInvoiceDto extends plainToClassDto {
  @Expose()
  @IsNotEmpty()
  @IsEnum(['cash', 'momo', 'vnpay'])
  paymentMethod: TPaymentMethods;

  @Expose()
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @Expose()
  userPhoneNumber?: string;
}
