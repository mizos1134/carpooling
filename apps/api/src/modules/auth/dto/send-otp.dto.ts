import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^\+?[0-9]+$/, { message: 'Invalid phone number format' })
  phone!: string;
}
