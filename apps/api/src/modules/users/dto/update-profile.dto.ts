import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
  PreferNotToSay = 'prefer_not_to_say',
}

export class UpdateProfileDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  lastName?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  bio?: string | null;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  city?: string | null;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender | null;

  @IsString()
  @IsOptional()
  preferredLanguage?: string;
}
