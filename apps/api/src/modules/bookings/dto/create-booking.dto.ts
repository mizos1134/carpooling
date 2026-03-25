import {
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateBookingDto {
  @IsUUID()
  rideId!: string;

  @IsUUID()
  pickupStopId!: string;

  @IsUUID()
  dropoffStopId!: string;

  @IsInt()
  @Min(1)
  @Max(8)
  seatsReserved!: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod = PaymentMethod.cash;
}
