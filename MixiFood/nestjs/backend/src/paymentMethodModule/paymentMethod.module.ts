import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentMethod,
  paymentMethodShema,
} from './schemas/paymentMethod.shema';
import { PaymentMethodService } from './paymentMethod.service';
import { VNPayModule } from 'src/vnpayModule/vnpay.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymentMethod.name,
        schema: paymentMethodShema,
      },
    ]),
    VNPayModule,
  ],
  providers: [PaymentMethodService],
  exports: [PaymentMethodService],
})
export class PaymentMeThodModule {}
