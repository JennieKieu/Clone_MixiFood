import { Expose, Type } from 'class-transformer';
import { plainToClassDto } from 'src/common/plainToClass.dto';
import { TDirection } from '../schemas/location.schema';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';

class DirectionDto extends plainToClassDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @Expose()
  full_address: string;
}

export class Location_RegisterDto extends plainToClassDto {
  @Expose()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => DirectionDto)
  direction: DirectionDto;
}
