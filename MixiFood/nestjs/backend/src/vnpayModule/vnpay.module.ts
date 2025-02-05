import { Module } from '@nestjs/common';
import { VNPayService } from './vnpay.service';
import { VnPayController } from './vnpay.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vnpay, vnPaySchema } from './shemas/vnPay.shema';
import { InvoiceModule } from 'src/invoiceModule/invoice.module';
import { NotificationModule } from 'src/notificationModule/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vnpay.name, schema: vnPaySchema }]),
    InvoiceModule,
    NotificationModule
  ],
  providers: [VNPayService],
  controllers: [VnPayController],
  exports: [VNPayService],
})
export class VNPayModule {}
