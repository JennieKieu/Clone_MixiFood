import { Expose } from 'class-transformer';
import { MenuFoodDto } from './menuFood.dto';
import { IsNotEmpty } from 'class-validator';

export class BevaragesDto extends MenuFoodDto {
  @Expose()
  @IsNotEmpty()
  volume: number;

  constructor(volume: number) {
    super();
    this.volume = volume;
  }
}
