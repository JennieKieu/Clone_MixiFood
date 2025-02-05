import { Expose, plainToClass, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { plainToClassDto } from 'src/common/plainToClass.dto';

export class KitchenChangeStatusOrderItemDto extends plainToClassDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  orderId: string;

  @Expose()
  @IsNotEmpty()
  foodItemId: string;

  @IsNotEmpty()
  @Expose()
  @IsIn(['cancel', 'complete'])
  status: 'cancel' | 'complete';
}

export class KitchenChangeMultipleStatusOrderItemsDto extends plainToClassDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  orderId: string;

  @IsArray()
  @IsString({ each: true })
  @Expose()
  pendingOrders: string[];

  @IsNotEmpty()
  @IsIn(['cancel', 'complete'])
  @Expose()
  status: 'cancel' | 'complete';
}
