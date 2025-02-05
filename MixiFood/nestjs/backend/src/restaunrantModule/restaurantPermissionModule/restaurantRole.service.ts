import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RestaurantPermission,
  RestaurantPermissionModel,
} from './schemas/restaurantPermission.schem';

@Injectable()
export class RestaurantPermissionService {
  constructor(
    @InjectModel(RestaurantPermission.name)
    private restaurantPermissionModel: RestaurantPermissionModel,
  ) {}
}
