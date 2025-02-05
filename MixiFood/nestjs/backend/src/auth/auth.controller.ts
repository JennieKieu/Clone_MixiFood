import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './userAuth/login-auth.dto';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { UserDto } from 'src/userModule/user.dto';
import { RestaurantDto } from 'src/restaunrantModule/restaurant.dto';
import { SmsOtpGuard } from 'src/config/guard/SmsOtpGuard';
import { SmsAuthDto } from './userAuth/sms-auth.dto';
import { SmsVerifyAuthDto } from './userAuth/smsVerify-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TUserUpload } from 'src/uploadModule/upload.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(LoginAuthDto.plainToClass(dto));
  }
  @Post('register-user')
  registerUser(@Body() dto: UserDto) {
    return this.authService.registerUser(UserDto.plainToClass(dto));
  }
  @Post('register-restaurant')
  registerRestaurant(@Body() dto: RestaurantDto) {
    return this.authService.registerRestaurant(RestaurantDto.plainToClass(dto));
  }

  @Post('smsOtp')
  // @UseGuards(SmsOtpGuard)
  sendSMSOtp(@Body() dto: SmsAuthDto) {
    try {
      return this.authService.sendSMSOtp(SmsAuthDto.plainToClass(dto));
    } catch (error) {
      console.log('send sms error', error);
    }
  }

  @Post('verifyOtp')
  @UseGuards(SmsOtpGuard)
  verifyAccount(@Body() dto: SmsVerifyAuthDto) {
    return this.authService.verifyOtp(SmsVerifyAuthDto.plainToClass(dto));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req) {
    return {
      data: {
        success: true,
        data: req.user,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Body('token') token: string) {
    return this.authService.verifyToken(token);
  }

  // update avatar
  @UseGuards(JwtAuthGuard)
  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
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
    avatar: Express.Multer.File,
  ) {
    console.log(req.user);

    const uploadKey: TUserUpload = 'avatar';
    return this.authService.uploadAvatar(
      req.user.role,
      req.user._id,
      uploadKey,
      avatar,
    );
  }

  // update cover image
  @UseGuards(JwtAuthGuard)
  @Post('uploadCoverImage')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(
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
    avatar: Express.Multer.File,
  ) {
    const uploadKey: TUserUpload = 'coverImage';
    return this.authService.uploadAvatar(
      req.user.role,
      req.user._id,
      uploadKey,
      avatar,
    );
  }
}
