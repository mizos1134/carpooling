import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumberString,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchRidesDto {
  @IsNumberString()
  originLat!: string;

  @IsNumberString()
  originLng!: string;

  @IsNumberString()
  destLat!: string;

  @IsNumberString()
  destLng!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(8)
  passengers?: number = 1;

  @IsOptional()
  @IsIn(['departure', 'price', 'rating'])
  sort?: 'departure' | 'price' | 'rating' = 'departure';
}
