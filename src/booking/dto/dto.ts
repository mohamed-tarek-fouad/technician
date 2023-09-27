import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class createReservationDto {
  @IsNumber()
  @IsNotEmpty()
  technecianId: number;
  // @IsDateString()
  @IsNotEmpty()
  date: string;
}
