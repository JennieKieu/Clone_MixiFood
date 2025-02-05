import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from './user.dto';
import { plainToClass } from 'class-transformer';
import { UserService } from './user.service';
import { ModuleRef } from '@nestjs/core';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { CreateBookingDto } from 'src/seatingbooking/dto/create-booking.dto';
import { SeatingBookingService } from 'src/seatingbooking/seatingBooking.service';
import { GetSeatingByDateTimeDto } from './dto/get-seatingByDateTime';
import { SeatService } from 'src/seatModule/seat.service';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly seatingBookingService: SeatingBookingService,
    private seatService: SeatService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getAllUser(@Req() request: Request) {
    return [
      {
        name: 'name1',
        age: 23,
      },

      {
        name: 'name2',
        age: 24,
      },
    ];
  }

  // @UsePipes(new ValidationPipe())

  // @Get(':id')
  // getUserById(@Param('id', ParseIntPipe) id: number) {
  //   return 'userId';
  // }

  // get publice restaurant infomation
  @Get('/restaurant/:id')
  getRestaurantInfomation(@Param() id: string) {
    return this.userService.getRestaurantInfomation(id);
  }

  // booking
  @UseGuards(JwtAuthGuard)
  @Post('booking')
  seatingBooking(@Request() req, @Body() dto: CreateBookingDto) {
    const userId = req.user._id;
    const userPhoneNumber: string = req.user.phoneNumber;

    return this.seatingBookingService.createBooking(
      userId,
      CreateBookingDto.plainToClass(dto),
      userPhoneNumber,
    );
  }

  // get seating on date time
  // @UseGuards(JwtAuthGuard)
  // @Post('seatingsByDateTime')
  // getSeatingsByDateTime(@Body() dto: GetSeatingByDateTimeDto) {}

  @UseGuards(JwtAuthGuard)
  @Get('seating/:id')
  getSeatingByBooking(@Param('id') restaurantId: string) {
    return this.seatService.getAllSeat(new Types.ObjectId(restaurantId));
  }

  @UseGuards(JwtAuthGuard)
  @Get('Verify/map')
  async verifyMap() {
    return {
      data: {
        success: true,
        accessKey: this.configService.get('mapboxAccessKey'),
      },
    };
  }

  // select seating
  @UseGuards(JwtAuthGuard)
  @Post('selectSeating')
  selectSeatingByBooking(@Request() req, @Body() dto: GetSeatingByDateTimeDto) {
    const userId = req.user._id;
    // console.log(userId);
    return this.userService.selectSeating(
      userId,
      GetSeatingByDateTimeDto.plainToClass(dto),
    );
  }
}
