import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { VNPayService } from './vnpay.service';
import { Request } from 'express';
import { TVnp_BankCode } from './types/vnpay.types';
import { Types } from 'mongoose';

@Controller('vnpay')
export class VnPayController {
  constructor(private readonly vnPayService: VNPayService) {}

  @Post('test')
  async testFC(
    @Body() body: { amount: number; bankCode?: string; language?: string },
    @Req() req: Request,
  ) {
    const { amount, bankCode, language } = body;

    // const paymentUrl = await this.vnPayService.createPaymentUrl(
    //   amount,
    //   req,
    //   language,
    //   new Types.ObjectId('6728706d77f040e498b9987f'),
    //   // bankCode,
    // );

    // return { paymentUrl };
  }

  @Get('test/:amount')
  async GtestFC(
    @Param('amount') amount1: number,
    // @Body() body: { amount: number; bankCode?: string; language?: string },
    @Req() req: Request,
    @Query('bankCode') bankCode?: TVnp_BankCode,
  ) {
    const language = 'vn';
    // const paymentUrl = await this.vnPayService.createPaymentUrl(
    //   'amount1',
    //   req,
    //   language,
    //   new Types.ObjectId('6728706d77f040e498b9987f'),
    //   bankCode,
    // );

    // if (!paymentUrl)
    //   return {
    //     data: { success: false, code: 97 },
    //   };

    // return { paymentUrl };
  }

  // vnpayreturn
  @Get('vnpay-return')
  vnpayReturn(@Req() req: Request) {
    return this.vnPayService.vnpay_return(req);
  }
}
