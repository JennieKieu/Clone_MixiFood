import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Invoice,
  InvoiceModel,
  TInvoiceStatus,
  TPaymentMethods,
} from './schemas/invoice.shema';
import { Types } from 'mongoose';
import { TDateFilter } from 'src/restaunrantModule/types/restaurant.types';
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
  addHours,
} from 'date-fns';
import { vietnamTime } from 'src/utils/vietnameTime.util';
import * as moment from 'moment';
import { OrderService } from 'src/orderModule/order.service';
import { SeatService } from 'src/seatModule/seat.service';
import { SocketGateWay } from 'src/gateway/gatewat.socketGateway';
import { NotificationService } from 'src/notificationModule/notification.service';
import { ESeatingStatus } from 'src/seatModule/schemas/seat.schemas';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: InvoiceModel,
    private readonly orderService: OrderService,
    private readonly seatService: SeatService,
    private readonly socketGateway: SocketGateWay,
    private readonly notification: NotificationService,
  ) {}

  // find invoice by id
  async getInvoiceById(restaurantId: Types.ObjectId, _id: string) {
    const invoice = await this.invoiceModel.findOne({
      restaurantId: restaurantId,
      _id: new Types.ObjectId(_id),
    });

    if (!invoice) throw new NotFoundException('Cannot find invoice');
    return invoice;
  }

  //   create invoice
  async createInvoice(
    restaurantId: string,
    employeeId: string,
    orderId: string,
    seatId: string,
    paymentMethod: TPaymentMethods,
    totalPrice: number,
    userPhoneNumber?: string,
  ) {
    const invoice = await new this.invoiceModel({
      restaurantId: new Types.ObjectId(restaurantId),
      employeeId: new Types.ObjectId(employeeId),
      orderId: new Types.ObjectId(orderId),
      seatId: new Types.ObjectId(seatId),
      paymentMethod: paymentMethod,
      userPhoneNumber,
      totalPrice,
    });

    this.seatService.changSeatingStatus(
      new Types.ObjectId(seatId),
      ESeatingStatus.paying,
    );

    return invoice.save();
  }

  // get all pendingInvoices
  async getPendingInvoices(restaurantId: Types.ObjectId) {
    const pendingInvoices = await this.invoiceModel.find({
      restaurantId: restaurantId,
      status: 'pending',
    });

    return pendingInvoices;
  }

  // get invoicies
  async getInvoices(
    restaurantId: Types.ObjectId,
    filter: TDateFilter,
    limit: number,
    offset: number,
    specificDate?: Date,
  ) {
    let startDate: Date;
    let endDate: Date;
    // const now = new Date();
    // const vietnamTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    // const now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    // const now = new Date(vietnamTime);
    const now = moment().utcOffset(7);

    // if (specificDate) {
    //   // startDate = startOfDay(specificDate);
    //   startDate = specificDate;
    //   endDate = endOfDay(specificDate);
    // } else {
    //   switch (filter) {
    //     case 'DAY':
    //       // startDate = addHours(startOfDay(now), 7);
    //       startDate = startOfDay(now);
    //       // startDate = now;
    //       endDate = endOfDay(now);
    //       // endDate = addHours(endOfDay(now), 7);
    //       break;
    //     case 'WEEK':
    //       startDate = addHours(startOfWeek(new Date()), 7);
    //       endDate = addHours(endOfWeek(new Date()), 7);
    //       break;
    //     case 'MONTH':
    //       // startDate = startOfMonth(now);
    //       startDate = addHours(startOfMonth(new Date()), 7);
    //       endDate = endOfMonth(now);
    //       break;
    //     default:
    //       throw new Error('Invalid filter type');
    //   }
    // }

    if (specificDate) {
      const specificMoment = moment(specificDate).utcOffset(7);
      startDate = specificMoment.startOf('day').toDate(); // Đầu ngày
      endDate = specificMoment.endOf('day').toDate(); // Cuối ngày
    } else {
      switch (filter) {
        case 'DAY':
          startDate = now.clone().startOf('day').toDate();
          endDate = now.clone().endOf('day').toDate();
          break;
        case 'WEEK':
          startDate = now.clone().startOf('week').toDate();
          endDate = now.clone().endOf('week').toDate();
          break;
        case 'MONTH':
          startDate = now.clone().startOf('month').toDate();
          endDate = now.clone().endOf('month').toDate();
          break;
        default:
          throw new Error('Invalid filter type');
      }
    }

    // console.log(startDate);
    // console.log(endDate);

    const Invoices = await this.invoiceModel
      .find({
        restaurantId: restaurantId,
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const totalRevenue = await this.getTotalRevenue(
      restaurantId,
      startDate,
      endDate,
    );

    return { Invoices, totalRevenue };
  }

  //
  async getTotalRevenue(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const invoices = await this.invoiceModel.find({
      restaurantId: restaurantId,
      createdAt: { $gte: startDate, $lte: endDate },
      status: 'success',
    });

    const totalRevenue = invoices.reduce(
      (sum, invoice) => sum + (invoice.totalPrice || 0),
      0,
    );

    return totalRevenue;
  }

  // get number invoices toDay
  async getNumberOfInvoicesToday(restaurantId: Types.ObjectId) {
    // const toDayStart = addHours(startOfDay(new Date()), 7);
    // const todayEnd = addHours(endOfDay(new Date()), 7);
    // const now = new Date(vietnamTime);
    const now = moment().utcOffset(7);

    // const toDayStart = startOfDay(now);
    // const todayEnd = endOfDay(now);

    const toDayStart = now.clone().startOf('day').toDate();
    const todayEnd = now.clone().endOf('day').toDate();

    return await this.invoiceModel.countDocuments({
      restaurantId: restaurantId,
      createdAt: {
        $gte: toDayStart,
        $lte: todayEnd,
      },
    });
  }

  // find by restaurantId and invoiceId
  async findInvoiceByRestaurantIdAndId(
    restaurantId: Types.ObjectId,
    _id: Types.ObjectId,
  ) {
    const invoice = await this.invoiceModel.findOne({
      restaurantId: restaurantId,
      _id: _id,
    });
    if (!invoice) {
      throw new NotFoundException('Cannot find invoice');
    }
    return invoice;
  }

  async vnpaySuccess(invoiceId: Types.ObjectId) {
    console.log(invoiceId);

    const invoice = await this.invoiceModel.findById(invoiceId);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    if (invoice.status === 'success')
      throw new InternalServerErrorException('Invoice is success');

    invoice.status = 'success';
    invoice.save();

    const order = await this.orderService.confirmOrderPaymet(
      invoice.restaurantId,
      invoice.orderId,
    );

    const seat = await this.seatService.onConfirmPayment(
      invoice.restaurantId,
      order.seatId,
    );

    // socket
    this.socketGateway.onServeSendInvoiceCashpayment(
      invoice.restaurantId.toString(),
      invoice,
    );

    this.socketGateway.onNotifyWaitPaymentGroup({
      orderId: invoice.orderId.toString(),
      message: 'Đã thanh toán thành công!',
    });

    // notifcation
    // this.notification.sendNotification

    return { success: true, invoice: invoice._id };
  }

  // find invoice by orderId and seatId
  async getInvoiceByOrderIdAndSeatId(
    restaurantId: Types.ObjectId,
    orderId: Types.ObjectId,
    seatId: Types.ObjectId,
    status: TInvoiceStatus,
  ) {
    const invoice = await this.invoiceModel.findOne({
      restaurantId: restaurantId,
      orderId: orderId,
      seatId: seatId,
      status: status,
    });

    if (!invoice) throw new NotFoundException('Cannot find invoice');
    return invoice;
  }
}
