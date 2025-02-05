import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from './userModule/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permissionModule/permission.module';
import { RoleModule } from './roleModule/role.module';
import { RestaurantModule } from './restaunrantModule/restaurant.module';
import { TwilioModule } from 'nestjs-twilio';
import { EmployeeModule } from './EmployeeModule/employee.module';
import { AppController } from './app.controller';
import { S3Module } from 'nestjs-s3';
import { UploadModule } from './uploadModule/upload.module';
import { GatewayModule } from './gateway/gateway.module';
import { OrderModule } from './orderModule/order.module';
import * as admin from 'firebase-admin';
import { NotificationModule } from './notificationModule/notification.module';
import { LocationModule } from './locationModule/location.module';
import { SeatingBookingModule } from './seatingbooking/seatingBooking.module';
import { ScheduleModule } from '@nestjs/schedule';
import { VNPayModule } from './vnpayModule/vnpay.module';
import { PaymentMeThodModule } from './paymentMethodModule/paymentMethod.module';
import { InvoiceModule } from './invoiceModule/invoice.module';

// ConfigModule.forRoot({
//   envFilePath: '.env',
//   isGlobal: true
// })

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configSecret: ConfigService) => ({
        uri: configSecret.get('mongoUri'),
      }),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configSecret: ConfigService) => ({
        config: {
          credentials: {
            accessKeyId: configSecret.get('awsAccessKeyId'),
            secretAccessKey: configSecret.get('awsSecretAccessKey'),
          },
          region: configSecret.get('awsRegion'),
          forcePathStyle: true,
        },
      }),
    }),
    UserModule,
    // RestaurantModule,
    PermissionModule,
    RoleModule,
    AuthModule,
    forwardRef(() => EmployeeModule),
    forwardRef(() => RestaurantModule),
    UploadModule,
    forwardRef(() => GatewayModule),
    // GatewayModule,
    OrderModule,
    NotificationModule,
    LocationModule,
    SeatingBookingModule,
    ScheduleModule.forRoot(),
    VNPayModule,
    PaymentMeThodModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  exports: [JwtModule],
})
export class Appmodule {
  constructor(private readonly configSecret: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configSecret.get('firebaseProjectId'),
        clientEmail: this.configSecret.get('firebaseClientEmail'),
        // privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        privateKey: this.configSecret.get('firebasePrivateKey'),
      }),
    });
  }
}
