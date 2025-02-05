import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { Types } from 'mongoose';
import { SeatService } from 'src/seatModule/seat.service';
import { EmployeeGuard } from 'src/config/guard/employee/EmployeeGuard';
import { FoodService } from 'src/menuFoodModule/FoodModule/food.service';
import { OrderDto } from 'src/orderModule/dto/Order.dto';
import { OrderService } from 'src/orderModule/order.service';
import { getSeatDto } from './dto/getSeatDto';
import { KitchenGuard } from 'src/config/guard/employee/KitchenGuard';
import {
  KitchenChangeMultipleStatusOrderItemsDto,
  KitchenChangeStatusOrderItemDto,
} from './dto/kitchenChangeOrderItemStatusDto';
import { RestaurantService } from 'src/restaunrantModule/restaurant.service';
import { EmpCreateInvoiceDto } from './dto/emp.CreateInvoice.dto';
import { NotificationService } from 'src/notificationModule/notification.service';

@Controller('employee')
export default class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly seatService: SeatService,
    private readonly foodService: FoodService,
    private readonly orderService: OrderService,
    private readonly restaurantService: RestaurantService,
  ) {}

  // Get all seatting
  @Get('seats')
  @UseGuards(JwtAuthGuard)
  @UseGuards(EmployeeGuard)
  getAllSeat(@Request() req) {
    console.log(req.user);

    const restaurantId: Types.ObjectId = new Types.ObjectId(
      req.user.restaurant as string,
    );
    return this.seatService.getAllSeat(restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(EmployeeGuard)
  @Post('seat')
  // get refesh Seat
  getSeatInfomation(@Request() req, @Body() dto: getSeatDto) {
    const restaurantId = req.user.restaurant;

    return this.seatService.getSeat(
      getSeatDto.plainToClass(dto).seatId,
      restaurantId,
    );
  }

  // get all food
  @Get('foods')
  @UseGuards(JwtAuthGuard)
  @UseGuards(EmployeeGuard)
  getAllFood(@Request() req) {
    const restaurantId: Types.ObjectId = new Types.ObjectId(
      req.user.restaurant as string,
    );

    return this.foodService.getAllFoodByRestaurantId(restaurantId);
  }

  // order food by seat
  @UseGuards(JwtAuthGuard)
  @UseGuards(EmployeeGuard)
  @Post('order')
  orderFoodBySeat(@Request() req, @Body() dto: OrderDto) {
    // console.log(req.user);
    const restaurantId: Types.ObjectId = new Types.ObjectId(
      req.user.restaurant as string,
    );
    const employeeId: Types.ObjectId = new Types.ObjectId(
      req.user._id as string,
    );
    return this.employeeService.createOrder(
      OrderDto.plainToClass(dto),
      restaurantId,
      employeeId,
    );
  }

  // next order by seatId and orderId
  @UseGuards(JwtAuthGuard)
  @UseGuards(EmployeeGuard)
  @Post('nextOrder')
  nextOrderBySeat(@Request() req, @Body() dto: OrderDto) {
    const restaurantId = req.user.restaurant;
    const employeeId: Types.ObjectId = new Types.ObjectId(
      req.user._id as string,
    );

    return this.employeeService.nextOrder(
      restaurantId,
      employeeId,
      OrderDto.plainToClass(dto),
    );
  }

  // get all order on status !== success
  @UseGuards(JwtAuthGuard)
  @UseGuards(EmployeeGuard)
  @Get('Orders')
  getAllOrders(@Request() req) {
    const restaurantId = req.user.restaurant;
    return this.employeeService.getOrdersByStatusNotSuccess(restaurantId);
  }

  // Get order item by seatId and orderId
  @UseGuards(JwtAuthGuard)
  @UseGuards(EmployeeGuard)
  @Post('getSeatOrder')
  getOrderItemBySeatId(@Request() req, @Body() dto: getSeatDto) {
    const restaurantId = req.user.restaurant;
    return this.employeeService.getOrderItemBySeatId(
      restaurantId,
      getSeatDto.plainToClass(dto).seatId,
    );
  }

  // get order by seatId
  @UseGuards(JwtAuthGuard, EmployeeGuard)
  @Get('seatByOrder/:seatId')
  async getOrderBySeatId(@Request() req, @Param('seatId') seatId: string) {
    const restaurantId = req.user.restaurant;
    const restaurant = await this.restaurantService.findOneById(restaurantId);

    return await this.employeeService.getOrderBySeatId(seatId, restaurant);
  }

  // Kitchen get all food when status === pending
  @UseGuards(JwtAuthGuard)
  @UseGuards(EmployeeGuard)
  @Get('pendingFoods')
  getAllFoodOrderPending(@Request() req) {
    const restaurantId = req.user.restaurant;

    return this.employeeService.getAllFoodOrderPending(restaurantId);
  }

  // kitchen change Status food ordering
  @UseGuards(JwtAuthGuard)
  @UseGuards(KitchenGuard)
  @Post('orderItem_status')
  kitchenChangePendingFoodStatus(
    @Request() req,
    @Body() dto: KitchenChangeStatusOrderItemDto,
  ) {
    const restaurantId = req.user.restaurant;

    return this.employeeService.kitchenChangePendingFoodStatus(
      KitchenChangeStatusOrderItemDto.plainToClass(dto),
      restaurantId,
    );
  }

  // kitchen change Status orderItems status
  @UseGuards(JwtAuthGuard)
  @UseGuards(KitchenGuard)
  @Post('change-status-multiple')
  async kitchenChangePendingFoodsStatus(
    @Request() req,
    @Body() dto: KitchenChangeMultipleStatusOrderItemsDto[],
  ) {
    const restaurantId = req.user.restaurant;

    for (const order of dto) {
      return await this.employeeService.kitchenChangePendingFoodsStatus(
        restaurantId,
        KitchenChangeMultipleStatusOrderItemsDto.plainToClass(order),
      );
    }
  }

  // employee change status orderItem => serve -> complete or canceling -> cancel
  @UseGuards(JwtAuthGuard)
  @UseGuards(KitchenGuard)
  @Post('orderItem-serve')
  serveChangeOrderItemStatus(
    @Request() req,
    @Body() dto: KitchenChangeStatusOrderItemDto,
  ) {
    const restaurantId = req.user.restaurant;

    return this.employeeService.serveChangeOrderItemStatus(
      KitchenChangeStatusOrderItemDto.plainToClass(dto),
      restaurantId,
    );
  }

  // Invoice
  // create invoice
  @UseGuards(JwtAuthGuard)
  @UseGuards(KitchenGuard)
  @Post('invoice')
  async createInvoice(@Request() req, @Body() dto: EmpCreateInvoiceDto) {
    const restaurantId = req.user.restaurant;
    const employeeId: Types.ObjectId = req.user._id;

    const restaurantFCM =
      await this.restaurantService.getFCMToken(restaurantId);

    return this.employeeService.createInvoice(
      restaurantId,
      employeeId.toString(),
      EmpCreateInvoiceDto.plainToClass(dto),
      restaurantFCM,
      req,
    );
  }
}
