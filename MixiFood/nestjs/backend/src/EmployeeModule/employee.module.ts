import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, employeeSchema } from './schemas/employee.schema';
import { EmployeeService } from './employee.service';
import EmployeeController from './employee.controller';
import { SeatModule } from 'src/seatModule/seat.module';
import { FoodService } from 'src/menuFoodModule/FoodModule/food.service';
import { FoodModule } from 'src/menuFoodModule/FoodModule/food.module';
import { OrderModule } from 'src/orderModule/order.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { RestaurantModule } from 'src/restaunrantModule/restaurant.module';
import { InvoiceModule } from 'src/invoiceModule/invoice.module';
import { NotificationModule } from 'src/notificationModule/notification.module';
import { PaymentMeThodModule } from 'src/paymentMethodModule/paymentMethod.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Employee.name,
        schema: employeeSchema,
      },
    ]),
    SeatModule,
    FoodModule,
    OrderModule,
    GatewayModule,
    forwardRef(() => RestaurantModule),
    InvoiceModule,
    NotificationModule,
    PaymentMeThodModule,
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController],
  exports: [EmployeeService, MongooseModule],
})
export class EmployeeModule {}
