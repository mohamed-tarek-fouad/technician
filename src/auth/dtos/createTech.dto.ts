/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTechDto {
  @MinLength(14)
  @IsNotEmpty()
  @MaxLength(14)
  nationalId: string;

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  jobTitle: string;
}
