import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class createReservationDto {
  @IsNumber()
  @IsNotEmpty()
  technicianId: number;
  // @IsDateString()
  @IsNotEmpty()
  date: string;
}
