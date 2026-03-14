import { IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^\+?[0-9]+$/, { message: 'Invalid phone number format' })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  @Matches(/^[0-9]+$/, { message: 'OTP must be numeric' })
  code!: string;
}
