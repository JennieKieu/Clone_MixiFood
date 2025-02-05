import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderModel } from './shemas/order.schemas';
import { OrderDto } from './dto/Order.dto';
import { Types } from 'mongoose';
import { SeatService } from 'src/seatModule/seat.service';
import { ESeatingStatus } from 'src/seatModule/schemas/seat.schemas';
import { SocketGateWay } from 'src/gateway/gatewat.socketGateway';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: OrderModel,
    private seatingService: SeatService,
    private socketService: SocketGateWay
  ) {}

  // Order
  //   change seating status is serve
  async createOrder(
    dto: OrderDto,
    restaurantId: Types.ObjectId,
    employeeId: Types.ObjectId,
  ) {
    const foodItems = dto.foodItems.map((item) => ({
      foodId: new Types.ObjectId(item.foodId),
      quantity: item.quantity,
      employeeIds: employeeId,
    }));

    const newOrder = await new this.orderModel({
      foodItems,
      restaurantId,
      employeeId,
      seatId: dto.seatId,
    }).save();

    // return await new this.orderModel({
    //   foodItems,
    //   restaurantId,
    //   employeeId,
    //   seatId: dto.seatId,
    // }).save();

    await this.seatingService.changSeatingStatus(
      new Types.ObjectId(dto.seatId),
      ESeatingStatus.serving,
    );

    return newOrder;
  }

  // find pending order by restaurantId and _id
  async pendingOrderByRestaurantIdAndId(
    restaurantId: Types.ObjectId,
    _id: Types.ObjectId,
  ) {
    const order = await this.orderModel.findOne({
      _id: _id,
      restaurantId: restaurantId,
    });

    if (!order || order.status !== 'payment')
      throw new NotFoundException('Cannot find order');
    return order;
  }

  // confirm order payement
  async confirmOrderPaymet(restaurantId: Types.ObjectId, _id: Types.ObjectId) {
    const order = await this.pendingOrderByRestaurantIdAndId(restaurantId, _id);
    console.log(order);

    if (!order || order.status !== 'payment')
      throw new NotFoundException('Cannot find order');
    order.status = 'complete';
    return await order.save();
  }
}
