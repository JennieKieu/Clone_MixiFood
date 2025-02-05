import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Seat, SeatSchema } from './schemas/seat.schemas';
import { SeatService } from './seat.service';
import { GatewayModule } from 'src/gateway/gateway.module';
import { BookingGateway } from 'src/gateway/booking.socket';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Seat.name,
        schema: SeatSchema,
      },
    ]),
    GatewayModule,
  ],
  providers: [SeatService], //service
  controllers: [],
  exports: [SeatService, MongooseModule],
})
export class SeatModule {}
