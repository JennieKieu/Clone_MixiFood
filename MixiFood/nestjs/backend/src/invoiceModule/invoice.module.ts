import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, invoiceShema } from './schemas/invoice.shema';
import { InvoiceService } from './invoice.service';
import { OrderModule } from 'src/orderModule/order.module';
import { SeatModule } from 'src/seatModule/seat.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { NotificationModule } from 'src/notificationModule/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Invoice.name,
        schema: invoiceShema,
      },
    ]),
    OrderModule,
    SeatModule,
    GatewayModule,
    NotificationModule,
  ],
  providers: [InvoiceService],
  controllers: [],
  exports: [InvoiceService],
})
export class InvoiceModule {}
