import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantDto } from './restaurant.dto';
import { MenuFoodDto } from 'src/menuFoodModule/dto/menuFood.dto';
import { EditEmployeeDto, EmployeeDto } from 'src/EmployeeModule/employee.dto';
import { RestaurantRoleGuard } from 'src/config/guard/restaurantGuard/RestaurantRoleGuard';
import { EditFoodDto, FoodDto } from 'src/menuFoodModule/dto/food.dto';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { FoodService } from 'src/menuFoodModule/FoodModule/food.service';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { RemoveFoodDto } from './dto/removeFood.dto';
import { SeatDto } from 'src/seatModule/dto/seat.dto';
import { SeatService } from 'src/seatModule/seat.service';
import { Get_confirmPaymentDto } from 'src/invoiceModule/dto/get-confirmPayment.dto';
import { TDateFilter } from './types/restaurant.types';
import { ParseDatePipe } from './piper/ParseDatePipe';
import { Location_RegisterDto } from 'src/locationModule/dto/Location-register.dto';
import { PaymentMethodService } from 'src/paymentMethodModule/paymentMethod.service';
import { CreateVnPayDto } from 'src/vnpayModule/dto/create_vnpay.dto';
import { SeatingBookingService } from 'src/seatingbooking/seatingBooking.service';
import {
  ESeatingBookingStatus,
  TSeatingBookingStatus,
} from 'src/seatingbooking/schemas/seatingBooking.schema';

@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly foodService: FoodService,
    private readonly seatService: SeatService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly seatingBookingService: SeatingBookingService,
  ) {}

  // @Post()
  // createRestaurant(@Body() restaurant: RestaurantDto) {
  //   return this.restaurantService.createRestaurant(
  //     RestaurantDto.plainToClass(restaurant),
  //   );
  // }

  // auth ?
  // createMenu
  @Post(':id/menu')
  createMenu(@Param('id') restaurantId: string, @Body() dto: MenuFoodDto) {
    return this.restaurantService.createMenu(
      restaurantId,
      MenuFoodDto.plainToClass(dto),
    );
  }

  // Employee
  // auth ?
  // create employee
  @Post(':id/employee')
  @UseGuards(RestaurantRoleGuard)
  createEmployee(@Param('id') restaurantId: string, @Body() dto: EmployeeDto) {
    return this.restaurantService.createEmployee(
      restaurantId,
      EmployeeDto.plainToClass(dto),
    );
  }

  // Get All Employee
  @Get(':id/employee')
  // @UseGuards(RestaurantRoleGuard)
  getAllEmployeeBy(@Param('id') restaurantId: string) {
    return this.restaurantService.getAllEmployee(restaurantId);
  }

  // delete employee
  @Delete(':id/employee')
  deleteEmployee(
    @Param('id') restaurantId: string,
    @Body() body: { employeeIds: string[] },
  ) {
    return this.restaurantService.deleteEmployee(
      restaurantId,
      body.employeeIds,
    );
  }
  // edit employee
  // @UseInterceptors(FileInterceptor('file'))
  @Post('/employee/edit/:id')
  @UseGuards(RestaurantRoleGuard)
  @UseGuards(JwtAuthGuard)
  editEmployee(
    @Request() req,
    @Body() dto: EditEmployeeDto,
    @Param('id') employeeId: string,
  ) {
    const restaurantId: Types.ObjectId = req.user._id;

    return this.restaurantService.editEmployee(
      restaurantId.toString(),
      new Types.ObjectId(employeeId),
      EmployeeDto.plainToClass(dto),
    );
  }

  // End Employee
  // Food
  // get all fodd
  @Get('food')
  @UseGuards(RestaurantRoleGuard)
  @UseGuards(JwtAuthGuard)
  getAllFood(@Request() req) {
    const restaurantId: Types.ObjectId = req.user._id;

    return this.foodService.getAllFoodByRestaurantId(restaurantId);
  }

  // create food:
  @UseInterceptors(FileInterceptor('file'))
  @Post('createFood')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  async createFood(
    @Body() dto: FoodDto,
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // limit file upload
          new MaxFileSizeValidator({
            maxSize: 52428800,
            message: 'File is too large. Max file size is 50MB',
          }),
          // fileType images
          new FileTypeValidator({ fileType: 'image' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // console.log(req.user._id.toString());
    const restaurantId = req.user._id;

    return this.foodService.createFood(
      restaurantId,
      FoodDto.plainToClass(dto),
      file,
      dto.isRemoveBg ? true : false,
    );
  }

  // delete food:
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Delete('food')
  deleteFoods(@Request() req, @Body() dto: RemoveFoodDto) {
    const restaurantId: Types.ObjectId = req.user._id;
    return this.foodService.deleteFoods(
      restaurantId,
      RemoveFoodDto.plainToClass(dto),
    );
  }

  // edit food
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Post('food/edit')
  editFood(
    @Body() dto: EditFoodDto,
    @Request() req,
    // @Param('id') foodId: string,

    @UploadedFile() file?: Express.Multer.File,
  ) {
    const restaurantId: Types.ObjectId = req.user._id;

    if (file) {
      if (file.size > 52428800) {
        throw new BadRequestException(
          'File is too large. Max file size is 50MB',
        );
      }

      if (!file.mimetype.startsWith('image')) {
        throw new BadRequestException('File type must be an image');
      }
    }

    return this.foodService.editFood(
      restaurantId,
      new Types.ObjectId(dto.foodId),
      FoodDto.plainToClass(dto),
      file,
    );
  }

  // Seat
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Get('seats')
  getAllSeatByRestaurantId(@Request() req) {
    const restaurantId: Types.ObjectId = req.user._id;

    return this.seatService.getAllSeat(restaurantId);
  }

  // create one seat
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Post('seat')
  createOneSeat(@Request() req, @Body() dto: SeatDto) {
    const restaurantId: Types.ObjectId = req.user._id;

    return this.seatService.createOneSeat(
      restaurantId,
      SeatDto.plainToClass(dto),
    );
  }

  // create many seat
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Post('seats')
  createManySeat(@Request() req, @Body() body: { numberOfSeats: number }) {
    console.log(body.numberOfSeats);
    if (
      !body.numberOfSeats ||
      body.numberOfSeats <= 0 ||
      body.numberOfSeats > 150
    ) {
      throw new BadRequestException(
        'Số lượng bàn phải lớn hơn 0 và không được vượt quá 150.',
      );
    }

    const restaurantId: Types.ObjectId = req.user._id;

    return this.seatService.createManySeat(restaurantId, body.numberOfSeats);
  }

  // invoices
  // get pendings invoices
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Get('invoices-pending')
  async getInvoices(@Request() req) {
    const restaurantId: Types.ObjectId = req.user._id;
    return await this.restaurantService.getPendingInvoices(restaurantId);
  }

  // confirm cash payment
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Post('confirmCashPayment')
  confirmCashPayment(@Request() req, @Body() dto: Get_confirmPaymentDto) {
    const restaurantId: Types.ObjectId = req.user._id;
    return this.restaurantService.confirmCashPayment(
      restaurantId,
      Get_confirmPaymentDto.plainToClass(dto),
    );
  }

  // get invoices by invoicesId
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Get('invoice/:id')
  getInvoice(@Param('id') invoiceId: string, @Request() req) {
    const restaurantId: Types.ObjectId = req.user._id;
    return this.restaurantService.getInvoidInformationById(
      restaurantId,
      invoiceId,
    );
  }

  // get invoices by filter date day, week, moonth
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Get('invoicies/:filter')
  getInvoicies(
    @Param('filter') filter: TDateFilter,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
    @Request() req,
    @Query('specificDate') specificDate?: Date,
  ) {
    if (specificDate && isNaN(new Date(specificDate).getTime())) {
      throw new BadRequestException('Invalid specificDate format');
    }

    const restaurantId: Types.ObjectId = req.user._id;
    return this.restaurantService.getInvoicesByDate(
      restaurantId,
      filter,
      limit,
      offset,
      specificDate,
    );
  }
  // get invoices by filter day

  // get number invoices to day
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Get('numberOfInvoices')
  getNumberInvoicesToday(@Request() req) {
    const restaurantId: Types.ObjectId = req.user._id;

    return this.restaurantService.getNumberInvoicesToday(restaurantId);
  }

  // update fcm token
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Post('fcmToken')
  updateFCMToken(@Request() req, @Body() body: { fcmToken: string }) {
    const restaurantId: Types.ObjectId = req.user._id;

    return this.restaurantService.updateFcmToken(restaurantId, body.fcmToken);
  }

  // set restaurantLocation
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Post('location/register')
  setRestaurantLocation(@Request() req, @Body() body: Location_RegisterDto) {
    const restaurantId: Types.ObjectId = req.user._id;

    console.log(body.direction);

    return this.restaurantService.setRestaurantLocation(
      restaurantId,
      Location_RegisterDto.plainToClass(body),
    );
  }

  // payment
  // add vnpayPayment
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Post('add_payment/vnpay')
  addVnPayPayment(@Request() req, @Body() dto: CreateVnPayDto) {
    const restaurantId: Types.ObjectId = req.user._id;

    return this.restaurantService.createVnPayPayment(
      restaurantId,
      CreateVnPayDto.plainToClass(dto),
    );
  }

  // booking
  // get booking request
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Get('booking/requests')
  getBookingRequests(
    @Request() req,
    @Query('status') status?: ESeatingBookingStatus,
  ) {
    const restaurantId: Types.ObjectId = req.user._id;

    return this.seatingBookingService.getBookingrequests(restaurantId, status);
  }

  // confirm booking request
  @UseGuards(JwtAuthGuard)
  @UseGuards(RestaurantRoleGuard)
  @Post('booking/confirm/:id')
  confirmBookingRequest(@Request() req, @Param('id') bookingId: string) {
    const restaurantId: Types.ObjectId = req.user._id;

    return this.seatingBookingService.confirmBookingRequestByRestaurant(
      new Types.ObjectId(bookingId),
      restaurantId,
    );
  }
}
