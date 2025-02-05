import { Injectable } from '@nestjs/common';
import {
  Location,
  LocationModel,
  TDirection,
  TOpenTimeOfDay,
} from './schemas/location.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private readonly locationModel: LocationModel,
  ) {}

  //   create location by restaurant
  async createLocationByRestaurant(
    restaurantId: Types.ObjectId,
    restaurantName: string,
    direction: TDirection,
    restaurantAvatar: string,
    full_address: string,
    openTimeOfDay?: TOpenTimeOfDay,
  ) {
    const newLocation = await new this.locationModel({
      restaurantId: restaurantId,
      direction: direction,
      directionName: restaurantName,
      directionAvatar: restaurantAvatar,
      full_address: full_address,
      openTimeOfDay,
    });

    return newLocation.save();
  }

  // get restaurantLocation
  async getRestaurantsLocation(
    longitude: number,
    latitude: number,
    limit: number,
    offset: number,
  ) {
    const restaurantLocations = await this.locationModel.find();

    return {
      data: {
        success: true,
        restaurantLocations,
      },
    };
  }
}
