import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/userModule/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RestaurantModule } from 'src/restaunrantModule/restaurant.module';
import { TwilioModule } from 'nestjs-twilio';
import { EmployeeModule } from 'src/EmployeeModule/employee.module';
import { UploadModule } from 'src/uploadModule/upload.module';

console.log(process.env.JWT_EXPIRATION);

@Module({
  imports: [
    UserModule,
    RestaurantModule,
    EmployeeModule,
    UploadModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configSecret: ConfigService) => ({
        secret: configSecret.get('jwtSecret'),
        signOptions: {
          expiresIn: configSecret.get('jwtExpration'),
        },
      }),
    }),
    TwilioModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configSecret: ConfigService) => ({
        accountSid: configSecret.get('twilio_SID'),
        authToken: configSecret.get('twilio_Token'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
