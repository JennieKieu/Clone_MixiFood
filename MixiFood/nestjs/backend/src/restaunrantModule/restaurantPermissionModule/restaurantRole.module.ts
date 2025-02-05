import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RestaurantPermission,
  restaurantPermissionSchema,
} from './schemas/restaurantPermission.schem';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RestaurantPermission.name,
        schema: restaurantPermissionSchema,
      },
    ]),
  ],
})
export class RestaurantPermissioNModule {}
