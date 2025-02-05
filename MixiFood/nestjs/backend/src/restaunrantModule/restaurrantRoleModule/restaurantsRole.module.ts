import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RestaurantRole,
  RestaurantRoleSchema,
} from './shemas/restaurantRole.schema';
import { RestaurantRoleService } from './restaurantRole.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RestaurantRole.name,
        schema: RestaurantRoleSchema,
      },
    ]),
  ],
  providers: [RestaurantRoleService],
  exports: [MongooseModule, RestaurantRoleService],
})
export class RestaurantRoleModule {}
