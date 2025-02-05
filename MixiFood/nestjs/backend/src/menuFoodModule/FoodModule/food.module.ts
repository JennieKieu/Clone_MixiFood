import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Food, FoodSchema } from './schemas/food.schema';
import { FoodService } from './food.service';
import { UploadModule } from 'src/uploadModule/upload.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]),
    UploadModule,
    GatewayModule,
  ],
  providers: [FoodService],
  controllers: [],
  exports: [FoodService, MongooseModule],
})
export class FoodModule {}
