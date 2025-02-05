import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ESeatingStatus, Seat, SeatModel } from './schemas/seat.schemas';
import { Types } from 'mongoose';
import { SeatDto } from './dto/seat.dto';
import { SocketGateWay } from 'src/gateway/gatewat.socketGateway';
import * as moment from 'moment';
import { GetSeatingByDateTimeDto } from 'src/userModule/dto/get-seatingByDateTime';
import { Cron } from '@nestjs/schedule';
import { BookingGateway } from 'src/gateway/booking.socket';

@Injectable()
export class SeatService {
  constructor(
    @InjectModel(Seat.name) private seatModel: SeatModel,
    private readonly socketGateway: SocketGateWay,
    // private readonly bookingSocket: BookingGateway,
  ) {}

  // get all seats by restaurantId
  async getAllSeat(restaurantId: Types.ObjectId) {
    const seats = await this.seatModel.find({ restaurantId: restaurantId });

    return {
      data: {
        success: true,
        seats: seats,
      },
    };
  }

  // get seat
  async getSeat(seatId: string, restaurantId: string) {
    return this.seatModel.findOne({
      _id: new Types.ObjectId(seatId),
      restaurantId: new Types.ObjectId(restaurantId),
    });
  }

  // create one seat / table ?
  async createOneSeat(restaurantId: Types.ObjectId, dto: SeatDto) {
    const seat = await new this.seatModel({
      ...dto,
      restaurantId: restaurantId,
    }).save();

    return {
      data: {
        success: true,
        seat: seat,
      },
    };
  }
  // create many seat
  async createManySeat(restaurantId: Types.ObjectId, numberOfSeats: number) {
    if (numberOfSeats > 150) {
      throw new BadRequestException('Số lượng bàn không được vượt quá 200.');
    }

    const seatsToCreate: SeatDto[] = [];

    for (let i = 1; i <= numberOfSeats; i++) {
      seatsToCreate.push({
        seatName: `Bàn ${i}`,
        restaurantId: restaurantId,
        maxOfPeople: 2,
      });
    }

    const seats = await this.seatModel.insertMany(seatsToCreate);

    this.socketGateway.onCreateManySeat(restaurantId.toString(), seats);

    return {
      data: {
        success: true,
        seats: seats,
      },
    };
  }

  // update status seat by employee order
  async employeeOrder(
    seatId: Types.ObjectId,
    orderId: Types.ObjectId,
    restaurantId: Types.ObjectId,
  ) {
    const updatedSeat = await this.seatModel.findOneAndUpdate(
      {
        _id: seatId,
        $or: [{ currentOrderId: { $exists: false } }, { currentOrderId: null }],
      },
      { $set: { currentOrderId: orderId } },
      { new: true },
    );

    return updatedSeat;
  }

  // handle confirm payement
  async onConfirmPayment(restaurantId: Types.ObjectId, _id: Types.ObjectId) {
    const seat = await this.seatModel.findOne({
      _id: _id,
      restaurantId: restaurantId,
    });
    seat.currentOrderId = null;
    seat.isServing = false;
    seat.status = ESeatingStatus.ready;
    // sockey
    this.socketGateway.onSeatChange(restaurantId.toString(), seat);
    return seat.save();
  }

  // booking
  async findSeatingForBooking(
    seatId: Types.ObjectId,
    restaurantId: Types.ObjectId,
    bookingTime: Date,
  ) {
    const seat = await this.seatModel.findOne({
      _id: seatId,
      restaurantId: restaurantId,
    });

    if (!seat) throw new NotFoundException('Cannon find seating!');

    if (seat.bookingTime && seat.bookingTime.length > 0) {
      const bookingTimeMoment = moment(bookingTime);

      const nearentBookingTime = seat.bookingTime
        .map((bt) => moment(bt.date))
        .sort(
          (a, b) =>
            Math.abs(a.diff(bookingTimeMoment)) -
            Math.abs(b.diff(bookingTimeMoment)),
        )[0];

      if (Math.abs(bookingTimeMoment.diff(nearentBookingTime, 'hour')) < 4) {
        throw new BadRequestException(
          `Booking time must be at least 4 hours apart from the nearest booking time (${nearentBookingTime.format()})`,
        );
      }
    }

    return seat;
  }

  // remove bookingTime for cancel booking
  async onCancelBooking(seatId: Types.ObjectId, CancelBookingTime: Date) {
    const formattedCancelBookingTime = moment(CancelBookingTime).toDate();

    const result = await this.seatModel.updateOne(
      { _id: seatId },
      {
        $pull: {
          bookingTime: { date: formattedCancelBookingTime },
        },
      },
    );

    // console.log(result);
  }

  // async addBookingTime(seatId: Types.ObjectId, restaurantId: Types.ObjectId, bookingTime: Date) {
  //   const seat
  // }

  // get seatings by selecting on booking
  async getSeatingsByBooking(restaurantId: Types.ObjectId) {
    try {
      const seatings = await this.seatModel.find({
        restaurantId: restaurantId,
      });

      return seatings;
    } catch (error) {
      console.log('get seating by booking error:', error);
    }
  }

  // select seating
  async selectSeating(userId: Types.ObjectId, dto: GetSeatingByDateTimeDto) {
    const seat = await this.seatModel.findOne({
      _id: new Types.ObjectId(dto.seatId),
    });

    if (!seat) {
      throw new NotFoundException(
        'Seat not found or does not belong to this restaurant.',
      );
    }

    // Kiểm tra xem thời gian booking hiện tại có trùng với booking đã có trong `seat.bookingTime` không
    const bookingTimeConflict = seat.bookingTime.some(
      (booking) => moment(booking.date).isSame(moment(dto.dateTime), 'minute'), // So sánh đến phút
    );

    if (bookingTimeConflict) {
      throw new BadRequestException(
        'Seat is already booked or selected at the given time.',
      );
    }

    const selectedTime = moment(dto.dateTime);
    const expireTime = selectedTime.clone().add(5, 'minutes');

    const isNearBookingTime = seat.isSelectByBooking.some((booking) => {
      const bookingTime = moment(booking.selectedTime);
      const timeDifference = Math.abs(
        bookingTime.diff(selectedTime, 'milliseconds'),
      );

      // Nếu chênh lệch thời gian nhỏ hơn hoặc bằng 4 giờ (4 giờ = 4 * 60 * 60 * 1000 milliseconds), thì không cho phép chọn
      return timeDifference <= 4 * 60 * 60 * 1000; // 4 giờ
    });

    if (isNearBookingTime) {
      throw new BadRequestException(
        'Seat cannot be selected within 4 hours of an existing selection.',
      );
    }

    // Loại bỏ bất kỳ ghế nào khác mà user này đã chọn
    const removed = await this.seatModel.findOne({
      'isSelectByBooking.userId': userId,
      restaurantId: seat.restaurantId,
    });

    await this.seatModel.updateMany(
      {
        'isSelectByBooking.userId': userId,
        restaurantId: seat.restaurantId,
      },
      {
        $pull: { isSelectByBooking: { userId } },
      },
    );

    // Kiểm tra và thêm vào mảng isSelectByBooking nếu nó chưa tồn tại
    if (!Array.isArray(seat.isSelectByBooking)) {
      seat.isSelectByBooking = [];
    }

    seat.isSelectByBooking.push({
      userId,
      selectedTime: selectedTime.toDate(), // Chuyển moment back to Date nếu cần lưu vào DB
      expireTime: expireTime.toDate(), // Chuyển moment back to Date nếu cần lưu vào DB
      createdAt: new Date(),
    });

    await seat.save();

    return {
      seat,
      removed,
    };
  }

  // auto remove expired seating
  @Cron('*/1 * * * *')
  async expiredSelecSeating() {
    const now = new Date();

    try {
      const seats = await this.seatModel.find({
        'isSelectByBooking.expireTime': { $lt: now },
      });

      for (const seat of seats) {
        seat.isSelectByBooking = seat.isSelectByBooking.filter(
          (booking) => booking.expireTime > now,
        );

        if (seat.isSelectByBooking.length === 0) {
          seat.isSelect = false;
        }

        // socket

        await seat.save();
      }
    } catch (error) {
      console.log('erro remove select seat', error);
    }
  }

  // change seating status
  async changSeatingStatus(seatId: Types.ObjectId, status: ESeatingStatus) {
    const seating = await this.seatModel.findById(seatId);

    seating.status = status;
    await seating.save();
    this.socketGateway.onSeatChange(seating.restaurantId.toString(), seating);

    return seating;
  }
}
