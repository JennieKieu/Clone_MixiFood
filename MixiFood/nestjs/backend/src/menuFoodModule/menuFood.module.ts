import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuFood, MenuFoodSchema } from './schemas/menuFood.schema';
import { Food, FoodSchema } from './FoodModule/schemas/food.schema';
import { Beverage, BeverageSchema } from './schemas/bevarages.schema';
import { MenuFoodService } from './menuFood.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MenuFood.name,
        schema: MenuFoodSchema,
      },
      {
        name: Food.name,
        schema: FoodSchema,
      },
      {
        name: Beverage.name,
        schema: BeverageSchema,
      },
    ]),
  ],
  providers: [MenuFoodService],
  controllers: [],
  exports: [MenuFoodService],
})
export class MenuFoodModule {}
