import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Food, FoodModel } from './schemas/food.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FoodDto } from '../dto/food.dto';
import { Types } from 'mongoose';
import { UploadService } from 'src/uploadModule/upload.service';
import { RemoveFoodDto } from 'src/restaunrantModule/dto/removeFood.dto';
import { SocketGateWay } from 'src/gateway/gatewat.socketGateway';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food.name) private foodModel: FoodModel,
    private readonly uploadService: UploadService,
    private readonly socketGateway: SocketGateWay,
  ) {}

  // get all food by restaurantId
  async getAllFoodByRestaurantId(restaurantId: Types.ObjectId) {
    const foods = await this.foodModel.find({ restaurantId: restaurantId });
    if (!foods) {
    }

    return {
      data: {
        success: true,
        foods: foods,
      },
    };
  }

  async createFood(
    restaurantId: Types.ObjectId,
    dto: FoodDto,
    file: Express.Multer.File,
    isRemoveBg: boolean,
  ) {
    const removeImgUrl = isRemoveBg
      ? await this.uploadService.removeImageBackground(file)
      : await this.uploadService.uploadFoodImgNotBg(file);
    if (!removeImgUrl) {
      throw new NotFoundException('upload avatar error');
    }
    // console.log(imageUrl.url);

    const foodData = {
      ...dto,
      restaurantId,
      foodImage: removeImgUrl.url,
      isRemoveBg,
    };
    const food = new this.foodModel(foodData);
    const foodSave = await food.save();
    this.socketGateway.onUpdateFood(food);
    return {
      data: {
        success: true,
        food: food,
      },
    };
  }

  // delete foods
  async deleteFoods(restaurantId: Types.ObjectId, foodIds: RemoveFoodDto) {
    const validFoodIds = foodIds.foodIds.filter((id) =>
      Types.ObjectId.isValid(id),
    );

    if (validFoodIds.length === 0) {
      throw new BadRequestException('No valid food IDs provided');
    }

    const existingFoods = await this.foodModel.find({
      _id: { $in: validFoodIds },
      restaurantId: restaurantId,
    });

    if (existingFoods.length === 0) {
      throw new NotFoundException('No foods found to delete');
    }

    const existingFoodIds = existingFoods.map((food) => food._id.toString());

    const updateResult = await this.foodModel.updateMany(
      {
        _id: { $in: existingFoodIds },
        restaurantId: restaurantId,
      },
      {
        $set: { isDelete: true }, // Chỉ thay đổi giá trị isDelete
      },
    );

    // const deleteFoods = await this.foodModel.deleteMany({
    //   _id: { $in: existingFoodIds },
    //   restaurantId: restaurantId,
    // });

    this.socketGateway.onDeleteFood(existingFoodIds, restaurantId.toString());

    return {
      data: {
        success: true,
        data: updateResult.modifiedCount.toString(),
        deletedIds: existingFoodIds,
      },
    };
  }

  async getFood(
    restaurantId: Types.ObjectId,
    foodId: Types.ObjectId,
    isDelete?: boolean,
  ) {
    const food = await this.foodModel.findOne({
      _id: foodId,
    });

    if (!food) throw new NotFoundException('Can not find food');

    return food;
  }

  // edit food
  async editFood(
    restaurantId: Types.ObjectId,
    foodId: Types.ObjectId,
    dto: FoodDto,
    file?: Express.Multer.File,
  ) {
    const food = await this.getFood(restaurantId, foodId, false);

    if (file) {
      const removeImgUrl = dto.isRemoveBg
        ? await this.uploadService.removeImageBackground(file)
        : await this.uploadService.uploadFoodImgNotBg(file);

      if (!removeImgUrl)
        throw new InternalServerErrorException('upload image error');
      food.foodImage = removeImgUrl.url;
    }

    Object.assign(food, FoodDto.plainToClass(dto));

    await food.save();

    return {
      data: { success: true, food },
    };
  }
}
