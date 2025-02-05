import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Employee,
  EmployeeDocument,
  EmployeeModel,
} from './schemas/employee.schema';
import { EmployeeDto } from './employee.dto';
import { ERestaurantRoleName } from 'src/restaunrantModule/restaurrantRoleModule/shemas/restaurantRole.schema';
import { Types } from 'mongoose';
import { BaseUserService } from 'src/common/baseUser.service';
import { OrderDto } from 'src/orderModule/dto/Order.dto';
import { OrderService } from 'src/orderModule/order.service';
import { SeatService } from 'src/seatModule/seat.service';
import {
  foodStatus,
  Order,
  OrderModel,
} from 'src/orderModule/shemas/order.schemas';
import { Seat, SeatModel } from 'src/seatModule/schemas/seat.schemas';
import {
  KitchenChangeMultipleStatusOrderItemsDto,
  KitchenChangeStatusOrderItemDto,
} from './dto/kitchenChangeOrderItemStatusDto';
import { SocketGateWay } from 'src/gateway/gatewat.socketGateway';
import {
  RestaurantDocument,
  RestaurantModel,
} from 'src/restaunrantModule/schemas/restaurant.schema';
import { RestaurantService } from 'src/restaunrantModule/restaurant.service';
import { FoodService } from 'src/menuFoodModule/FoodModule/food.service';
import { Food } from 'src/menuFoodModule/FoodModule/schemas/food.schema';
import { FoodModel } from 'src/menuFoodModule/schemas/bevarages.schema';
import { EmpCreateInvoiceDto } from './dto/emp.CreateInvoice.dto';
import { InvoiceService } from 'src/invoiceModule/invoice.service';
import { NotificationService } from 'src/notificationModule/notification.service';
import { PaymentMethodService } from 'src/paymentMethodModule/paymentMethod.service';
import { Request } from 'express';

@Injectable()
export class EmployeeService extends BaseUserService<EmployeeDocument> {
  constructor(
    @InjectModel(Employee.name) private employeeModel: EmployeeModel,
    @InjectModel(Seat.name) private seatModel: SeatModel,
    @InjectModel(Order.name) private orderModel: OrderModel,
    @InjectModel(Order.name) private restaurantModel: RestaurantModel,
    @InjectModel(Food.name) private foodModel: FoodModel,
    private orderService: OrderService,
    private seatService: SeatService,
    private readonly socketGateway: SocketGateWay,
    // private readonly foodService: FoodService,
    private readonly invoiceService: InvoiceService,
    private readonly notificationService: NotificationService,
    private readonly paymentMethodService: PaymentMethodService,
  ) {
    super(employeeModel);
  }

  // get all employee
  async getAllEmployeeByRestaurant(restaurantId: string) {
    const listEmployees = this.employeeModel.find({ restaurant: restaurantId });
    return listEmployees;
  }

  // delete employee
  async deleteEmployee(restaurantId: string, employeeIds: string[]) {
    return await this.employeeModel.deleteMany({
      _id: { $in: employeeIds },
      restaurant: restaurantId,
    });
  }

  // create employee
  async createEmployee(employee: EmployeeDto) {
    if (!(await this.employeeModel.isThisPhoneUser(employee.phoneNumber))) {
      throw new ConflictException('Phone number already exists');
    }

    const newEmployee = new this.employeeModel({
      ...employee,
    });
    return newEmployee.save();
  }

  // login
  async validateEmployee(phoneNumber: string, password: string) {
    const employee = await this.employeeModel
      .findOne({ phoneNumber })
      .select('+password')
      .exec();

    if (!employee) {
      throw new NotFoundException('Could not find user.');
    }
    const isPasswordCorrect = await employee.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new NotFoundException('Incorrect password');
    }

    return employee;
  }
  // set role

  // order by seat
  async createOrder(
    dto: OrderDto,
    restaurantId: Types.ObjectId,
    employeeId: Types.ObjectId,
  ) {
    const seatId = new Types.ObjectId(dto.seatId);

    const expandedFoodItems = dto.foodItems.flatMap((item) => {
      const foodId = item.foodId;
      const quantity = item.quantity || 1;

      return Array(quantity)
        .fill(null)
        .map(() => ({
          foodId,
          quantity: 1,
        }));
    });

    const updatedDto = {
      ...dto,
      foodItems: expandedFoodItems,
    };

    const order = await this.orderService.createOrder(
      updatedDto,
      restaurantId,
      employeeId,
    );

    // const order = await this.orderService.createOrder(
    //   dto,
    //   restaurantId,
    //   employeeId,
    // );

    if (!order) {
      // ?
    }

    const data = {
      orderId: order._id.toString(),
      pendingFoodItems: order.foodItems,
      seatId: order.seatId,
    };

    this.socketGateway.onEmployeeOrder(data, restaurantId.toString());

    const seat = await this.seatService.employeeOrder(
      seatId,
      order._id,
      restaurantId,
    );

    if (!seat) {
      await this.orderModel.findByIdAndDelete(order._id);
      throw new NotFoundException('Seat is required');
    }

    const dataOnSeat = {
      seatId: seatId.toString(),
      currentOrderId: seat.currentOrderId.toString(),
    };

    this.socketGateway.onSetOrderIdAtSeat(dataOnSeat, restaurantId.toString());

    return {
      data: {
        success: true,
        order: order,
        seat: seat,
      },
    };
  }

  // next order by orderId and seatId
  async nextOrder(
    restaurantId: string,
    employeeId: Types.ObjectId,
    dto: OrderDto,
  ) {
    const seat = await this.seatModel.findOne({
      _id: new Types.ObjectId(dto.seatId),
      restaurantId: new Types.ObjectId(restaurantId),
    });
    if (!seat) {
      throw new NotFoundException('Cannot find seat');
    }
    if (!seat.currentOrderId) {
      throw new BadRequestException(
        'This table has an existing order that has not been paid.',
      );
    }
    const order = await this.orderModel.findOne({
      _id: seat.currentOrderId,
    });

    // dto.foodItems.forEach((newItem) => {
    //   const existingItem = order.foodItems.find(
    //     (item) => item.foodId.toString() === newItem.foodId,
    //   );

    //   if (existingItem) {
    //     existingItem.quantity += newItem.quantity;
    //   } else {
    //     order.foodItems.push({
    //       foodId: new Types.ObjectId(newItem.foodId),
    //       quantity: newItem.quantity,
    //       status: 'pending',
    //       employeeIds: employeeId,
    //       orderTime: new Date(),
    //     });
    //   }
    // });

    dto.foodItems.forEach((newItem) => {
      // Thêm món mới vào foodItems mà không cần kiểm tra foodId
      order.foodItems.push({
        foodId: new Types.ObjectId(newItem.foodId),
        quantity: newItem.quantity,
        status: 'pending', // Trạng thái cho món mới là pending
        orderTime: new Date(),
        employeeIds: employeeId,
      });
    });

    const data = {
      orderId: order._id.toString(),
      pendingFoodItems: order.foodItems,
      seatId: order.seatId,
    };

    this.socketGateway.onEmployeeOrder(data, restaurantId.toString());

    return {
      data: {
        success: true,
        order: await order.save(),
      },
    };
  }

  // get all order on status !== success
  async getOrdersByStatusNotSuccess(restaurantId: string) {
    const orders = await this.orderModel.find({
      restaurantId: new Types.ObjectId(restaurantId),
      status: { $ne: 'complete' },
    });
    return {
      data: {
        success: true,
        orders,
      },
    };
  }

  // get order on seat by orderId
  async getOrderItemBySeatId(restaurantId: string, seatId: string) {
    const orderSeat = await this.seatModel.findOne({
      _id: new Types.ObjectId(seatId),
      restaurantId: new Types.ObjectId(restaurantId),
      currentOrderId: { $exists: true, $ne: null },
    });
    if (!orderSeat) {
      throw new NotFoundException(
        'This seat is currently not available for ordering',
      );
    }
    const orderFoods = await this.orderModel.findOne({
      _id: orderSeat.currentOrderId,
    });

    return {
      data: {
        success: true,
        orderFoods,
      },
    };
  }

  async getOrderBySeatId(seatId: string, restaurant: RestaurantDocument) {
    const seat = await this.seatModel.findById(new Types.ObjectId(seatId));
    if (!seat) throw new NotFoundException('Cannot find Seat');
    else if (!seat.currentOrderId)
      throw new NotFoundException('Cannot find order by seat');
    const orderId = seat.currentOrderId;
    const order = await this.orderModel.findById(orderId);

    const foodItemsWithPrice = await Promise.all(
      order.foodItems.map(async (item) => {
        const food = await this.foodModel.findById(item.foodId); // Lấy thông tin món ăn dựa trên foodId
        if (!food)
          throw new NotFoundException(
            `Food item not found for ID ${item.foodId}`,
          );

        const totalPrice =
          item.status !== 'cancel' && item.status !== 'canceling'
            ? food.price * item.quantity
            : 0; // Tính tổng giá cho từng item
        return {
          foodId: item.foodId,
          quantity: item.quantity,
          status: item.status,
          orderTime: item.orderTime,
          employeeIds: item.employeeIds,
          _id: item._id,
          foodName: food.name,
          totalPrice,
        };
      }),
    );

    const totalAmount = foodItemsWithPrice.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    // console.log(totalAmount);

    let invoice = undefined;
    if (order.status === 'payment') {
      invoice = await this.invoiceService.getInvoiceByOrderIdAndSeatId(
        restaurant._id,
        orderId,
        seat._id,
        'pending',
      );
    }

    const data = {
      success: true,
      order: {
        ...order.toObject(),
        foodItems: foodItemsWithPrice, // Cập nhật foodItems với trường totalPrice
        totalAmount,
      },
      restaurant,
      invoice,
    };

    return {
      data,
    };
  }

  // Kitchen get all food when status === pending
  async getAllFoodOrderPending(restaurantId: string) {
    const orders = await this.orderModel.find({
      restaurantId: new Types.ObjectId(restaurantId),
      status: 'serving',
    });

    const pendingOrders = orders
      .map((order) => ({
        seatId: order.seatId,
        orderId: order._id,
        pendingFoodItems: order.foodItems.filter(
          (item) => item.status === 'pending',
        ),
      }))
      .filter((order) => order.pendingFoodItems.length > 0);

    return {
      data: {
        success: true,
        pendingOrders,
      },
    };
  }

  async kitchenChangePendingFoodStatus(
    dto: KitchenChangeStatusOrderItemDto,
    restaurantId: string,
  ) {
    const order = await this.orderModel.findById(
      new Types.ObjectId(dto.orderId),
    );

    const foodItem = order.foodItems.find(
      (item) => item._id.toString() === dto.foodItemId,
    );

    if (!foodItem) {
      throw new NotFoundException('Cannot find orderItem');
    }

    foodItem.status = dto.status === 'complete' ? 'serve' : 'canceling';

    this.socketGateway.onKitchenChangeOrderItemStatus(
      {
        foodItemId: dto.foodItemId,
        orderId: dto.orderId,
        status: foodItem.status,
      },
      restaurantId.toString(),
    );

    // socket
    this.socketGateway.onKitchenChangeOrderItemStatusToServe(
      order,
      restaurantId.toString(),
    );

    return {
      data: {
        success: true,
        order: await order.save(),
        foodItem,
      },
    };
  }

  // kit chen change multi status
  async kitchenChangePendingFoodsStatus(
    restaurantId: string,
    dto: KitchenChangeMultipleStatusOrderItemsDto,
  ) {
    const { orderId, pendingOrders, status } = dto;

    const order = await this.orderModel.findById(new Types.ObjectId(orderId));
    if (!order) {
      throw new NotFoundException('Cannot find order');
    }

    const updatedFoodItems = [];
    for (const foodItemId of pendingOrders) {
      const foodItem = order.foodItems.find(
        (item) => item._id.toString() === foodItemId,
      );

      if (!foodItem) {
        throw new NotFoundException(
          `Cannot find foodItem with id ${foodItemId}`,
        );
      }

      foodItem.status = status === 'complete' ? 'serve' : 'canceling';
      updatedFoodItems.push(foodItem);
    }

    await order.save();

    // socket
    this.socketGateway.onKitchenChangeOrderItemStatusToServe(
      order,
      restaurantId.toString(),
    );

    return {
      data: {
        success: true,
        order,
        updatedFoodItems,
      },
    };
  }

  async serveChangeOrderItemStatus(
    dto: KitchenChangeStatusOrderItemDto,
    restaurantId: string,
  ) {
    const order = await this.orderModel.findById(
      new Types.ObjectId(dto.orderId),
    );

    const foodItem = order.foodItems.find(
      (item) =>
        (item._id.toString() === dto.foodItemId && item.status === 'serve') ||
        item.status === 'canceling',
    );

    if (!foodItem) {
      throw new NotFoundException('Cannot find orderItem');
    }

    foodItem.status = dto.status === 'complete' ? 'complete' : 'cancel';

    // socket ?

    this.socketGateway.onKitchenChangeOrderItemStatus(
      {
        orderId: order._id.toString(),
        foodItemId: dto.foodItemId,
        status: dto.status === 'complete' ? 'complete' : 'cancel',
      },
      restaurantId.toString(),
    );

    return {
      data: {
        success: true,
        order: await order.save(),
        foodItem,
      },
    };
  }

  // invoice
  // createInvoice
  async createInvoice(
    restaurantId: string,
    employeeId: string,
    dto: EmpCreateInvoiceDto,
    fcmToken: string,
    req: Request,
  ) {
    if (dto.paymentMethod === 'momo')
      throw new InternalServerErrorException('Comming son!');
    const order = await this.orderModel.findById(dto.orderId);

    if (!order) {
      throw new NotFoundException('Cannot find order!');
    } else if (order.status === 'complete') {
      throw new NotFoundException('Order is completed');
    } else if (order.status === 'payment')
      throw new NotFoundException('Order is invoice');

    const seatId = order.seatId.toString();
    const orderId = order._id.toString();

    const totalAmount = await this.calculateTotalAmount(order.foodItems);

    // cash payment
    const invoice = await this.invoiceService.createInvoice(
      restaurantId,
      employeeId,
      orderId,
      seatId,
      dto.paymentMethod,
      totalAmount,
      dto.userPhoneNumber,
    );
    order.status = 'payment';
    await order.save();
    const seat = await this.seatService.getSeat(seatId, restaurantId);

    // socket
    this.socketGateway.onServeSendInvoiceCashpayment(restaurantId, invoice);
    // notification
    this.notificationService.sendPaymentRequestNotification(
      {
        token: fcmToken,
        title: 'Bạn có 1 yêu cầu thanh toán',
        body: `Yêu cầu thanh toán hoá đơn bàn ${seat.seatName}`,
      },
      new Types.ObjectId(restaurantId),
    );

    if (dto.paymentMethod === 'cash') {
      return {
        data: {
          success: true,
          invoice,
          order,
        },
      };
    }
    // vnpay payment
    else if (dto.paymentMethod === 'vnpay') {
      // get vnpay by restaurantId
      // const vnPayPayment = await
      const vnpayUrl = await this.paymentMethodService.onlinePayment(
        new Types.ObjectId(restaurantId),
        'vnpay',
        totalAmount,
        req,
        invoice._id,
      );

      invoice.vnpayUrl = vnpayUrl;
      await invoice.save();

      return {
        data: {
          success: true,
          invoice,
          order,
        },
      };
    }

    // if (dto.paymentMethod === 'cash') {
    // }
    // // vnpay payment
    // else if (dto.paymentMethod === 'vnpay') {
    // } else if (dto.paymentMethod === 'momo') {
    //   throw new InternalServerErrorException('Comming son!');
    // }
  }

  async calculateTotalAmount(
    foodItems: {
      foodId: Types.ObjectId;
      quantity: number;
      status: foodStatus;
    }[],
  ) {
    let totalAmount = 0;

    for (const item of foodItems) {
      if (item.status === 'cancel' || item.status === 'canceling') {
        continue; // Bỏ qua các món có trạng thái cancel hoặc canceling
      }

      const food = await this.foodModel.findById(item.foodId);
      if (!food) {
        throw new NotFoundException(
          `Food item with id ${item.foodId} not found`,
        );
      }

      // Tính tiền cho các món có trạng thái khác cancel hoặc canceling
      totalAmount += food.price * item.quantity;
    }

    return totalAmount;
  }
}
