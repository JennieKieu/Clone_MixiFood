import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Restaurant,
  RestaurantDocument,
  RestaurantModel,
} from './schemas/restaurant.schema';
import {
  ERoleName,
  Role,
  RoleModel,
} from 'src/roleModule/roleSchemas/Role.schema';
import { RestaurantDto } from './restaurant.dto';
import { BaseUserService } from 'src/common/baseUser.service';
import { MenuFood } from 'src/menuFoodModule/schemas/menuFood.schema';
import { MenuFoodService } from 'src/menuFoodModule/menuFood.service';
import { MenuFoodDto } from 'src/menuFoodModule/dto/menuFood.dto';
import {
  RestaurantRole,
  RestaurantRoleModel,
} from './restaurrantRoleModule/shemas/restaurantRole.schema';
import { EditEmployeeDto, EmployeeDto } from 'src/EmployeeModule/employee.dto';
import {
  Employee,
  EmployeeModel,
} from 'src/EmployeeModule/schemas/employee.schema';
import { RestaurantRoleService } from './restaurrantRoleModule/restaurantRole.service';
import { Document, Types } from 'mongoose';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { FoodDto } from 'src/menuFoodModule/dto/food.dto';
import { UserType } from 'src/auth/userAuth/login-auth.dto';
import { SocketGateWay } from 'src/gateway/gatewat.socketGateway';
import { InvoiceService } from 'src/invoiceModule/invoice.service';
import { ESeatingStatus, SeatModel } from 'src/seatModule/schemas/seat.schemas';
import { SeatService } from 'src/seatModule/seat.service';
import { Order, OrderModel } from 'src/orderModule/shemas/order.schemas';
import {
  Food,
  FoodModel,
} from 'src/menuFoodModule/FoodModule/schemas/food.schema';
import { Get_confirmPaymentDto } from 'src/invoiceModule/dto/get-confirmPayment.dto';
import { OrderService } from 'src/orderModule/order.service';
import { TDateFilter } from './types/restaurant.types';
import { LocationService } from 'src/locationModule/location.service';
import { Location_RegisterDto } from 'src/locationModule/dto/Location-register.dto';
import { TOpenTimeOfDay } from 'src/locationModule/schemas/location.schema';
import { CreateVnPayDto } from 'src/vnpayModule/dto/create_vnpay.dto';
import { TAddPaymentMethodType } from 'src/paymentMethodModule/schemas/paymentMethod.shema';
import { PaymentMethodService } from 'src/paymentMethodModule/paymentMethod.service';
import { NotificationService } from 'src/notificationModule/notification.service';
import { SeatingBookingService } from 'src/seatingbooking/seatingBooking.service';

@Injectable()
export class RestaurantService extends BaseUserService<RestaurantDocument> {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: RestaurantModel,
    @InjectModel(Role.name) private roleModel: RoleModel,
    @InjectModel(Employee.name) private employeeModel: EmployeeModel,
    @InjectModel(Employee.name) private seatModel: SeatModel,
    @InjectModel(Order.name) private orderModel: OrderModel,
    @InjectModel(Food.name) private foodModel: FoodModel,
    @InjectModel(RestaurantRole.name)
    private restaurantRoleModel: RestaurantRoleModel,
    private menuFoodService: MenuFoodService,
    private restaurantRoleService: RestaurantRoleService,
    private employeeService: EmployeeService,
    private readonly socketGateway: SocketGateWay,
    private readonly invoiceService: InvoiceService,
    private readonly seatService: SeatService,
    private readonly orderService: OrderService,
    private readonly locationService: LocationService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly notificationService: NotificationService,
  ) {
    super(restaurantModel);
  }

  async findRestaurantOrEmployeeByPhoneNumber(phoneNumber: string) {
    const restaurant = await this.restaurantModel.findOne({ phoneNumber });
    const employee = await this.employeeModel.findOne({ phoneNumber });
    if (restaurant) {
      return UserType.Restaurant;
    } else if (employee) {
      return UserType.Employee;
    } else {
      throw new NotFoundException('Could not find user');
    }
  }

  // public infomation
  async getPublicInfomation(restaurantId: string) {
    // const restaurant = await this.findOneById(restaurantId);
    const restaurant = await this.restaurantModel
      .findById(new Types.ObjectId(restaurantId))
      .select(
        '-phoneNumber -role -timeRevokeToken -isActived -restaurantRoles -createdAt -updatedAt -fcmToken',
      )
      .exec();
    if (!restaurant) throw new NotFoundException('Cannot find restaurant!');
    return restaurant;
  }

  async createRestaurant(restaurant: RestaurantDto, smsOtp: string) {
    if (!(await this.restaurantModel.isThisPhoneUser(restaurant.phoneNumber))) {
      throw new ConflictException('Phone number already exists');
    } else if (
      !(await this.restaurantModel.isThisEmailUser(restaurant.email))
    ) {
      throw new NotFoundException('email already exists');
    }

    const newRestaurant = new this.restaurantModel({
      ...restaurant,
      role: ERoleName.restaurant,
      smsVerificationCode: smsOtp,
    });

    const savedRestaurant = await newRestaurant.save();

    console.log(newRestaurant);

    const adminRole = new this.restaurantRoleModel({
      roleName: ERoleName.admin,
      restaurant: newRestaurant._id,
      permissions: [],
    });

    const saveAdminRole = await adminRole.save();

    newRestaurant.restaurantRoles.push(saveAdminRole._id);
    const defaultRoles =
      await this.restaurantRoleService.createDefaultRestaurantRolesIfNotExists(
        newRestaurant._id,
      );
    return newRestaurant.save();
  }

  //
  async createEmployee(restaurantId: string, employee: EmployeeDto) {
    if (!(await this.findOneById(restaurantId))) {
      throw new NotFoundException('Restaurant is exists');
    }

    if (
      !(await this.restaurantModel.isThisPhoneUser(employee.phoneNumber)) ||
      !(await this.employeeModel.isThisPhoneUser(employee.phoneNumber))
    ) {
      throw new ConflictException('Phone number already exists');
    }

    const newEmployee = new this.employeeModel({
      ...employee,
      restaurant: restaurantId,
      role: ERoleName.employee,
    });

    console.log(newEmployee);

    const savedEmployee = await newEmployee.save();

    console.log(savedEmployee.restaurant);
    await this.restaurantRoleService.addEmployeeRole(
      restaurantId,
      employee.restaurantRole,
      newEmployee._id,
    );

    return {
      data: {
        success: true,
        employee: newEmployee,
      },
    };
  }

  // get All Employee
  async getAllEmployee(restaurantId: string) {
    // return this.employeeService.getAllEmployeeByRestaurant(restaurantId);
    const employees =
      await this.employeeService.getAllEmployeeByRestaurant(restaurantId);
    console.log(employees);

    return {
      success: true,
      data: employees,
    };
  }
  // delete employees
  async deleteEmployee(restaurantId: string, employeeIds: string[]) {
    const restaurant = await this.findOneById(restaurantId);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const deleteEmpl = await this.employeeService.deleteEmployee(
      restaurantId,
      employeeIds,
    );

    await this.restaurantRoleService.removeEmployeeRoles(
      restaurantId,
      employeeIds,
    );

    return {
      data: {
        success: true,
        data: deleteEmpl.deletedCount.toString(),
      },
    };
  }

  async editEmployee(
    restaurantId: string,
    employeeId: Types.ObjectId,
    dto: EditEmployeeDto,
  ) {
    const employee = await this.employeeModel.findOneAndUpdate(
      {
        _id: employeeId,
        restaurant: restaurantId,
      },
      {
        $set: dto,
      },
      { new: true },
    );

    if (!employee) throw new NotFoundException('Can not find employee!');

    return {
      data: {
        success: true,
        employee,
      },
    };
  }

  //

  async validateRestaurant(phoneNumber: string, password: string) {
    const restaurant = await this.restaurantModel
      .findOne({ phoneNumber })
      .select('+password')
      .exec();
    if (!restaurant) {
      throw new NotFoundException('could not find restaurant.');
    }
    const isPasswordCorrect = await restaurant.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new ConflictException('incorrect password');
    }
    return restaurant;
  }

  // async findOneById(id: string) {
  //   const restaurant = await this.restaurantModel.findById(id).exec();
  //   if (!restaurant) {
  //     throw new NotFoundException('could not find user');
  //   }
  //   return restaurant;
  // }

  // async findOneByPhoneNumber(phoneNumber: string) {
  //   const restaurant = await this.restaurantModel
  //     .findOne({ phoneNumber: phoneNumber })
  //     .exec();
  //   if (!restaurant) {
  //     throw new NotFoundException('could not find user');
  //   }
  //   return restaurant;
  // }

  // create menu

  async createMenu(restaurantId: string, menuData: MenuFoodDto) {
    const restaurant = await this.restaurantModel.findById(restaurantId).exec();
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const newMenu = await this.menuFoodService.createMenu(menuData);

    restaurant.menus.push(newMenu._id);
    await restaurant.save();

    return newMenu;
  }

  // Food
  // create food
  async createFood(restaurantId: string, dto: FoodDto) {}

  // End food

  // invoice
  // get invoices by pending
  async getPendingInvoices(restaurantId: Types.ObjectId) {
    const pendingInvoices =
      await this.invoiceService.getPendingInvoices(restaurantId);

    const invoicesWithEmployeeName = await Promise.all(
      pendingInvoices.map(async (invoice) => {
        const employee = await this.employeeService.findOneById(
          invoice.employeeId.toString(),
        );
        const seat = await this.seatService.getSeat(
          invoice.seatId.toString(),
          restaurantId.toString(),
        );

        const order = await this.orderModel.findById(invoice.orderId);
        // const orderItems = order ? order.foodItems : [];
        const orderItems = await Promise.all(
          order
            ? order.foodItems.map(async (item) => {
                const food = await this.foodModel.findOne({
                  _id: item.foodId,
                  restaurantId: restaurantId,
                });
                const unitPrice = food ? food.price : 0;
                const price =
                  food &&
                  item.status !== 'cancel' &&
                  item.status !== 'canceling'
                    ? unitPrice * item.quantity
                    : 0;

                // return {
                //   ...item.toObject(),
                //   price: price * item.quantity || 0,
                //   unitPrice: price,
                // };
                return {
                  foodId: item.foodId,
                  quantity: item.quantity,
                  status: item.status,
                  orderTime: item.orderTime,
                  employeeIds: item.employeeIds,
                  _id: item._id,
                  unitPrice: unitPrice, // Giá mỗi đơn vị
                  price: price, // Tổng giá cho món ăn
                };
              })
            : [],
        );

        const invoiceObject = invoice.toObject();

        return {
          ...invoiceObject,
          employeeName: employee ? employee.fullName : 'Unknow',
          employeeAvatar: employee.avatar,
          seatName: seat.seatName,
          orderItems,
          totalPrice: orderItems.reduce((total, item) => {
            return total + item.price;
          }, 0),
        };
      }),
    );

    return {
      data: {
        success: true,
        invoicesWithEmployeeName,
      },
    };
  }

  // invoices history
  async getInvoicesByDate(
    restaurantId: Types.ObjectId,
    filter: TDateFilter,
    limit: number,
    offset: number,
    specificDate?: Date,
  ) {
    const { Invoices: invoices, totalRevenue } =
      await this.invoiceService.getInvoices(
        restaurantId,
        filter,
        limit,
        offset,
        specificDate,
      );

    const invoicesWithEmployeeName = await Promise.all(
      invoices.map(async (invoice) => {
        const employee = await this.employeeService.findOneById(
          invoice.employeeId.toString(),
        );
        const seat = await this.seatService.getSeat(
          invoice.seatId.toString(),
          restaurantId.toString(),
        );

        const order = await this.orderModel.findById(invoice.orderId);
        // const orderItems = order ? order.foodItems : [];
        const orderItems = await Promise.all(
          order
            ? order.foodItems.map(async (item) => {
                const food = await this.foodModel.findOne({
                  _id: item.foodId,
                  restaurantId: restaurantId,
                });
                const unitPrice = food ? food.price : 0;
                const price =
                  food &&
                  item.status !== 'cancel' &&
                  item.status !== 'canceling'
                    ? unitPrice * item.quantity
                    : 0;

                // return {
                //   ...item.toObject(),
                //   price: price * item.quantity || 0,
                //   unitPrice: price,
                // };
                return {
                  foodId: item.foodId,
                  quantity: item.quantity,
                  status: item.status,
                  orderTime: item.orderTime,
                  employeeIds: item.employeeIds || '',
                  _id: item._id,
                  unitPrice: unitPrice, // Giá mỗi đơn vị
                  price: price, // Tổng giá cho món ăn
                };
              })
            : [],
        );

        const invoiceObject = invoice.toObject();

        return {
          ...invoiceObject,
          employeeName: employee ? employee.fullName : 'Delete employee',
          employeeAvatar: employee ? employee.avatar : 'Delete employee',
          seatName: seat.seatName,
          orderItems,
          totalPrice: orderItems.reduce((total, item) => {
            return total + item.price;
          }, 0),
        };
      }),
    );

    return {
      data: {
        success: true,
        invoicesWithEmployeeName,
        totalRevenue,
      },
    };
  }

  // get number invoices of today
  async getNumberInvoicesToday(restaurantId: Types.ObjectId) {
    const numberOfInvoices =
      await this.invoiceService.getNumberOfInvoicesToday(restaurantId);

    return {
      data: {
        success: true,
        numberOfInvoices: numberOfInvoices,
      },
    };
  }

  // confirm cash payment
  async confirmCashPayment(
    restaurantId: Types.ObjectId,
    dto: Get_confirmPaymentDto,
  ) {
    const invoice = await this.invoiceService.findInvoiceByRestaurantIdAndId(
      restaurantId,
      new Types.ObjectId(dto.invoiceId),
    );

    if (invoice.status !== 'pending')
      throw new BadRequestException('Invoice đã được xác nhận hoặc bị hủy.');
    const orderId = invoice.orderId;
    const order = await this.orderService.confirmOrderPaymet(
      restaurantId,
      orderId,
    );
    const seat = await this.seatService.onConfirmPayment(
      restaurantId,
      invoice.seatId,
    );

    invoice.status = 'success';
    (invoice.paymentMethod = 'cash'), delete invoice.vnpayUrl;

    this.socketGateway.onServeSendInvoiceCashpayment(
      restaurantId.toString(),
      invoice,
    );

    this.socketGateway.onNotifyWaitPaymentGroup({
      orderId: order._id.toString(),
      message: 'Đã thanh toán thành công!',
    });

    await this.seatService.changSeatingStatus(seat.id, ESeatingStatus.ready);

    return {
      data: {
        success: true,
        invoice: invoice.save(),
        order,
        seat,
      },
    };
  }

  // get invoice by Id
  async getInvoidInformationById(
    restaurantId: Types.ObjectId,
    invoiceId: string,
  ) {
    const invoice = await this.invoiceService.getInvoiceById(
      restaurantId,
      invoiceId,
    );

    const order = await this.orderModel.findById(invoice.orderId);

    const orderItems = await Promise.all(
      order
        ? order.foodItems.map(async (item) => {
            const food = await this.foodModel.findOne({
              _id: item.foodId,
              restaurantId: restaurantId,
            });
            const unitPrice = food ? food.price : 0;
            const price =
              food && item.status !== 'cancel' && item.status !== 'canceling'
                ? unitPrice * item.quantity
                : 0;

            return {
              foodId: item.foodId,
              quantity: item.quantity,
              status: item.status,
              orderTime: item.orderTime,
              employeeIds: item.employeeIds,
              foodName: food.name,
              _id: item._id,
              unitPrice: unitPrice, // Giá mỗi đơn vị
              price: price, // Tổng giá cho món ăn
            };
          })
        : [],
    );

    const restaurant = await this.findOneById(restaurantId.toString());

    const seat = await this.seatService.getSeat(
      invoice.seatId.toString(),
      restaurantId.toString(),
    );

    return {
      data: {
        success: true,
        invoice,
        orderItems,
        restaurant,
        seat,
        totalPrice: orderItems.reduce((total, item) => {
          return total + item.price;
        }, 0),
      },
    };
  }

  // get FCM token
  async getFCMToken(restaurantId: Types.ObjectId) {
    // const restaurant = await this.findOneById(restaurantId.toString());
    // return restaurant.fcmToken || '';

    // new
    return this.notificationService.getFcmToken(restaurantId);
  }

  async updateFcmToken(restaurantId: Types.ObjectId, fcmToken: string) {
    // const restaurant = await this.findOneById(restaurantId.toString());
    // if (restaurant.fcmToken !== fcmToken) restaurant.fcmToken = fcmToken;
    // return restaurant.save();

    // new
    return this.notificationService.createOrUpdateFcmToken(
      restaurantId,
      fcmToken,
    );
  }

  // set restaurant location
  async setRestaurantLocation(
    restaurantId: Types.ObjectId,
    dto: Location_RegisterDto,
  ) {
    const restaurant = await this.findOneById(restaurantId.toString());

    if (restaurant.locationId) {
      throw new NotFoundException('The restaurant has confirmed its location');
    }

    const location = await this.locationService.createLocationByRestaurant(
      restaurantId,
      restaurant.restaurantName,
      { longitude: dto.direction.longitude, latitude: dto.direction.latitude },
      restaurant.avatar,
      dto.direction.full_address,
      restaurant.openTimeOfDay ? restaurant.openTimeOfDay : undefined,
    );

    restaurant.locationId = location._id;
    await restaurant.save();

    return {
      data: {
        success: true,
        restaurant,
        location,
      },
    };
  }

  // payment
  // create vnpay payment
  async createVnPayPayment(restaurantId: Types.ObjectId, dto: CreateVnPayDto) {
    const paymentType: TAddPaymentMethodType = 'vnpay';
    const restaurant = await this.findOneById(restaurantId.toString());

    const paymentMethod =
      await this.paymentMethodService.createPaymentMethodByRestaurant(
        restaurantId,
        paymentType,
        dto,
      );

    restaurant.paymentMethods.push({
      paymentMethodId: paymentMethod._id,
      paymentMethodName: paymentMethod.paymentMethodName,
    });
    await restaurant.save();

    return {
      data: {
        success: true,
        paymentMethod,
      },
    };
  }

  // booking
  // get booking requests
  async getBookingrequests(restaurantId: Types.ObjectId) {
    // this.boking
  }
}
