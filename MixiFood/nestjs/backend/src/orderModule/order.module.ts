import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from './shemas/order.schemas';
import { OrderService } from './order.service';
import { FoodModule } from 'src/menuFoodModule/FoodModule/food.module';
import { SeatModule } from 'src/seatModule/seat.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: orderSchema,
      },
    ]),
    FoodModule,
    SeatModule,
    GatewayModule,
  ],
  providers: [OrderService],
  controllers: [],
  exports: [OrderService, MongooseModule],
})
export class OrderModule {}
