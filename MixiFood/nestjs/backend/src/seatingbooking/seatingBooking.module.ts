import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SeatingBooking,
  seatingBookingSchema,
} from './schemas/seatingBooking.schema';
import { SeatingBookingService } from './seatingBooking.service';
import { RestaurantModule } from 'src/restaunrantModule/restaurant.module';
import { SeatModule } from 'src/seatModule/seat.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GatewayModule } from 'src/gateway/gateway.module';
import { NotificationModule } from 'src/notificationModule/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SeatingBooking.name,
        schema: seatingBookingSchema,
      },
    ]),
    forwardRef(() => RestaurantModule),
    SeatModule,
    ScheduleModule,
    GatewayModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [SeatingBookingService],
  exports: [SeatingBookingService],
})
export class SeatingBookingModule {}
