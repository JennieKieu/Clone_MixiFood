import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PaymentMethod,
  PaymentMethodModel,
  TAddPaymentMethodType,
} from './schemas/paymentMethod.shema';
import { Types } from 'mongoose';
import { CreateVnPayDto } from 'src/vnpayModule/dto/create_vnpay.dto';
import { VNPayService } from 'src/vnpayModule/vnpay.service';
import { Request } from 'express';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectModel(PaymentMethod.name)
    readonly paymentMethodModel: PaymentMethodModel,
    private readonly vnpayService: VNPayService,
  ) {}

  //   create paymentMethod by restaurant
  async createPaymentMethodByRestaurant(
    restaurantId: Types.ObjectId,
    paymentType: TAddPaymentMethodType,
    vnpayDto?: CreateVnPayDto,
  ) {
    const vnpayId = await this.vnpayService.createVnPayByRestaurant(vnpayDto);

    const paymentMethod = await new this.paymentMethodModel({
      restaurantId: restaurantId,
      paymentMethodName: paymentType,
      paymentId: vnpayId,
    });

    return paymentMethod.save();
  }

  //   get all paymentMethods name by restaurantId
  async getPaymentMethodsNameByRestaurantId(restaurantId: Types.ObjectId) {
    const paymentMethods = await this.paymentMethodModel
      .find({ restaurantId, isDelete: false })
      .select('paymentMethodName')
      .exec();

    return paymentMethods.map((pm) => pm.paymentMethodName);
  }

  //   create oline payment
  async onlinePayment(
    restaurantId: Types.ObjectId,
    paymentType: TAddPaymentMethodType,
    amount: number,
    req: Request,
    invoiceId: Types.ObjectId,
  ) {
    const paymentMethod = await this.paymentMethodModel.findOne({
      restaurantId,
      paymentMethodName: paymentType,
      isDelete: false,
    });

    if (!paymentMethod) {
      throw new Error('Payment method not found or has been deleted');
    }

    if (paymentMethod.paymentMethodName === 'vnpay') {
      return this.vnpayService.createPaymentUrl(
        paymentMethod.paymentId,
        amount,
        req,
        '',
        invoiceId,
      );
    }
  }
}
