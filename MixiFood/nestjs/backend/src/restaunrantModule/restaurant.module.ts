import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, restaurantSchema } from './schemas/restaurant.schema';
import { RoleModule } from 'src/roleModule/role.module';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { MenuFoodModule } from 'src/menuFoodModule/menuFood.module';
import { RestaurantRoleModule } from './restaurrantRoleModule/restaurantsRole.module';
import { EmployeeModule } from 'src/EmployeeModule/employee.module';
import { FoodModule } from 'src/menuFoodModule/FoodModule/food.module';
import { SeatModule } from 'src/seatModule/seat.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { InvoiceModule } from 'src/invoiceModule/invoice.module';
import { OrderModule } from 'src/orderModule/order.module';
import { LocationModule } from 'src/locationModule/location.module';
import { PaymentMeThodModule } from 'src/paymentMethodModule/paymentMethod.module';
import { NotificationModule } from 'src/notificationModule/notification.module';
import { SeatingBookingModule } from 'src/seatingbooking/seatingBooking.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Restaurant.name,
        schema: restaurantSchema,
      },
    ]),
    forwardRef(() => EmployeeModule),
    RoleModule,
    MenuFoodModule,
    RestaurantRoleModule,
    FoodModule,
    SeatModule,
    GatewayModule,
    InvoiceModule,
    OrderModule,
    LocationModule,
    PaymentMeThodModule,
    NotificationModule,
    forwardRef(() => SeatingBookingModule),
  ],
  providers: [RestaurantService],
  controllers: [RestaurantController],
  exports: [RestaurantService, MongooseModule],
})
export class RestaurantModule {}
