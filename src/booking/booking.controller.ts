import { BookingService } from './booking.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../jwtAuthGuard';
import { createReservationDto } from './dto/dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}
  @UseGuards(JwtAuthGuard)
  @Get('allBookings')
  allBookings() {
    return this.bookingService.findAllreservations();
  }
  @UseGuards(JwtAuthGuard)
  @Get('myBookings')
  myBookings(@Req() request) {
    return this.bookingService.findUserAllReservations(request);
  }
  @UseGuards(JwtAuthGuard)
  @Post('bookTechnician')
  bookTech(@Body() createReservationDto: createReservationDto, @Req() request) {
    return this.bookingService.reserveTechnician(createReservationDto, request);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('cancelBooking/:bookingId')
  deleteBooking(@Req() request, @Param('bookingId') bookingId: number) {
    return this.bookingService.deleteBooking(+bookingId, request);
  }
}
