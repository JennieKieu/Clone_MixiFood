import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Location, locationShema } from './schemas/location.schema';
import { LocationService } from './location.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Location.name,
        schema: locationShema,
      },
    ]),
    HttpModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
