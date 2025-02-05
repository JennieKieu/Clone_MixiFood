import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { Request } from 'express';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { TVnp_BankCode } from './types/vnpay.types';
import { Types } from 'mongoose';
import { CreateVnPayDto } from './dto/create_vnpay.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Vnpay, VnpayModel } from './shemas/vnPay.shema';
import { InvoiceService } from 'src/invoiceModule/invoice.service';
import { NotificationService } from 'src/notificationModule/notification.service';

enum EVnp_Command {
  'pay' = 'pay',
}

enum EVnp_CurrCode {
  'VND' = 'VND',
}

type TVnp_Params = {
  vnp_Version: string;
  vnp_Command: EVnp_Command;
  vnp_TmnCode: string;
  vnp_Amount: number;
  vnp_CurrCode: EVnp_CurrCode;
  vnp_TxnRef: Types.ObjectId;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_ReturnUrl: string;
  vnp_IpAddr: string | string[];
  vnp_CreateDate: string;
  vnp_Locale: string;
  vnp_BankCode?: TVnp_BankCode;
  vnp_SecureHash?: string;
  vnp_SecureHashType?: any;
  vnp_ResponseCode?: any;
};

type TVnp_Results = {
  invoiceId: string;
} & TVnp_Params;

@Injectable()
export class VNPayService {
  constructor(
    @InjectModel(Vnpay.name) readonly vnpayModel: VnpayModel,
    private readonly config: ConfigService,
    private readonly invoiceService: InvoiceService,
    private readonly notificationService: NotificationService,
  ) {}

  // create vnpay for restaurant
  async createVnPayByRestaurant(dto: CreateVnPayDto) {
    const newVnPay = await new this.vnpayModel({
      ...dto,
    }).save();

    return newVnPay._id;
  }

  // get pay by paymentId
  async getPaymentById(paymentId: Types.ObjectId) {
    const vnpay = await this.vnpayModel.findById(paymentId);
    if (!vnpay) {
      throw new NotFoundException('Cannot find vnpay payment!');
    }

    return vnpay;
  }

  async createPaymentUrl(
    paymentId: Types.ObjectId,
    amount: number,
    req: Request,
    language = 'vn',
    orderId: Types.ObjectId,
    bankCode?: TVnp_BankCode,
  ) {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    // const orderId = moment(date).format('DDHHmmss');
    const tmnCode = this.config.get('vnpTMNCode');
    const returnUrl = this.config.get('vnpReturnUrl');
    const secretKey = this.config.get('vnpHashSecret');
    const vnpTz = this.config.get('vnpTz');
    let vnpUrl = this.config.get('vnpUri');

    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    let vnp_Params: TVnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: EVnp_Command.pay,
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: EVnp_CurrCode.VND,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'ThanhtoanchoGD' + orderId,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params.vnp_BankCode = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    vnp_Params.vnp_SecureHash = signed;
    console.log(vnp_Params);

    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  }

  // vnpayReturn
  async vnpay_return(req: Request) {
    let vnp_Params: TVnp_Results = req.query as unknown as TVnp_Results;

    let secureHash = vnp_Params.vnp_SecureHash;

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    vnp_Params = this.sortObject(vnp_Params);

    const tmnCode = this.config.get('vnpTMNCode');
    const secretKey = this.config.get('vnpHashSecret');
    const signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    console.log('code', vnp_Params.vnp_ResponseCode);

    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
      if (vnp_Params.vnp_ResponseCode === '00') {
        return await this.invoiceService.vnpaySuccess(
          new Types.ObjectId(vnp_Params.vnp_TxnRef),
        );
      }

      return {
        data: { success: true, data: { code: vnp_Params.vnp_ResponseCode } },
      };
      // res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
    } else {
      // res.render('success', { code: '97' });
      return {
        data: { success: true, data: { code: 97 } },
      };
    }
  }

  // vnpay_Ipn
  async vnpay_ipn(req: Request) {
    let vnp_Params: TVnp_Params = req.query as unknown as TVnp_Params;

    let secureHash = vnp_Params['vnp_SecureHash'];
  }

  private sortObject(obj: Object) {
    const sorted: any = {};
    const str = [];

    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }
}
