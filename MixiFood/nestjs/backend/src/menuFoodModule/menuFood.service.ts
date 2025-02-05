import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MenuFood, MenuFoodModel } from './schemas/menuFood.schema';
import { MenuFoodDto } from './dto/menuFood.dto';
import { promises } from 'dns';

@Injectable()
export class MenuFoodService {
  constructor(
    @InjectModel(MenuFood.name) private menuFoodModel: MenuFoodModel,
  ) {}

  async createMenu(menuData: MenuFoodDto) {
    const newMenu = new this.menuFoodModel(menuData);
    return newMenu.save();
  }
}
