import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ESeatingBookingStatus,
  SeatingBooking,
  SeatingBookingModel,
  TSeatingBookingStatus,
} from './schemas/seatingBooking.schema';
import { Types } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RestaurantService } from 'src/restaunrantModule/restaurant.service';
import { SeatService } from 'src/seatModule/seat.service';
import * as moment from 'moment';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SocketGateWay } from 'src/gateway/gatewat.socketGateway';
import { NotificationService } from 'src/notificationModule/notification.service';

@Injectable()
export class SeatingBookingService {
  constructor(
    @InjectModel(SeatingBooking.name)
    private seatingBookingModel: SeatingBookingModel,
    private readonly restaurantService: RestaurantService,
    private readonly seatService: SeatService,
    private readonly socketGateway: SocketGateWay,
    private readonly notificationService: NotificationService,
  ) {}

  // create booking
  async createBooking(
    userId: Types.ObjectId,
    dto: CreateBookingDto,
    contactPhoneNumber: string,
  ) {
    const restaurant = await this.restaurantService.findOneById(
      dto.restaurantId.toString(),
    );

    const seating = await this.seatService.findSeatingForBooking(
      new Types.ObjectId(dto.seatingId),
      restaurant._id,
      dto.bookingTime,
    );

    const currentTime = moment();
    const bookingTime = moment(dto.bookingTime);

    if (bookingTime.isBefore(currentTime.add(30, 'minutes'))) {
      throw new BadRequestException(
        'Booking time must be at least 30 minutes from now',
      );
    }

    if (bookingTime.isAfter(currentTime.add(1, 'week'))) {
      throw new BadRequestException(
        'Booking time cannot be more than 1 week from now',
      );
    }

    const booking = await new this.seatingBookingModel({
      restaurantId: restaurant._id,
      userId,
      ...dto,
      seatingId: seating._id,
      contactPhoneNumber,
      seatingName: seating.seatName,
    }).save();

    await seating.bookingTime.push({ date: dto.bookingTime });
    await seating.save();

    // socket ?

    // notification
    await this.notificationService.sendRequestBookingNotification({
      token: restaurant.fcmToken,
      body: 'Bạn có 1 yêu cầu đặt bàn mới xác nhận ngay!',
      title: 'Booking',
    });

    return {
      data: { success: true, seating, restaurant, booking },
    };
  }

  // auto change expired booking status
  // @Cron(CronExpression.EVERY_5_MINUTES)
  @Cron('*/1 * * * *')
  async cancelExpiredBookings() {
    const now = new Date();

    // await this.seatingBookingModel.updateMany(
    //   {
    //     status: 'pending',
    //     bookingExpiresAt: { $lt: now },
    //   },
    //   { status: 'cancel' },
    // );

    const expiredBookings = await this.seatingBookingModel.find({
      status: 'pending',
      bookingExpiresAt: { $lt: now },
    });

    if (expiredBookings.length > 0) {
      const bookingIds = expiredBookings.map((booking) => booking._id);

      await this.seatingBookingModel.updateMany(
        { _id: { $in: bookingIds } },
        { status: 'cancel' },
      );

      for (const booking of expiredBookings) {
        await this.seatService.onCancelBooking(
          booking.seatingId,
          booking.bookingTime,
        );
      }
    }

    // console.log('Checked for expired bookings and updated status to cancel');

    //  socket
    // notification
  }

  async getBookingrequests(
    restaurantId: Types.ObjectId,
    status?: ESeatingBookingStatus,
  ) {
    const query: any = { restaurantId: restaurantId.toString() };
    if (status) query.status = status;

    const bookings = await this.seatingBookingModel.find(query);

    return {
      data: {
        success: true,
        bookings,
      },
    };
  }

  // restaurant confirm booking
  async confirmBookingRequestByRestaurant(
    bookingId: Types.ObjectId,
    restaurantId: Types.ObjectId,
  ) {
    const booking = await this.seatingBookingModel.findOne({
      _id: bookingId,
      status: ESeatingBookingStatus.success,
    });

    if (!booking) throw new NotFoundException('Cannot find request booking!');
    booking.status = ESeatingBookingStatus.success;

    await booking.save();

    return {
      data: {
        success: true,
        booking,
      },
    };
  }
}
