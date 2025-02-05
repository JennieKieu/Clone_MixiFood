import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { User, userSchema } from './schemas/User.schema';
import { RoleModule } from 'src/roleModule/role.module';
import { TwilioModule } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';
import { RestaurantModule } from 'src/restaunrantModule/restaurant.module';
import { SeatingBookingModule } from 'src/seatingbooking/seatingBooking.module';
import { SeatModule } from 'src/seatModule/seat.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
    RoleModule,
    RestaurantModule,
    SeatingBookingModule,
    SeatModule,
  ],
  // providers:[{
  //     provide: 'UserService',
  //     useClass: UserService
  // }]
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
