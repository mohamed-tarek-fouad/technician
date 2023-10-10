import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { createReservationDto } from './dto/dto';

@Injectable()
export class BookingService {
  constructor(private database: DatabaseService) {}
  //make reservation
  async reserveTechnician(createReservationDto: createReservationDto, request) {
    try {
      const newReservation = await this.database.booking.create({
        data: {
          userId: request.user.tokenId,
          TechnicianId: createReservationDto.technicianId,
          date: createReservationDto.date,
        },
      });
      return { data: newReservation };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //delete reservation
  async deleteBooking(bookingId: number, request) {
    try {
      const reservation = await this.database.booking.findUnique({
        where: {
          id: bookingId,
        },
      });
      if (reservation.userId !== request.user.tokenId) {
        throw new HttpException(
          'you can not delete others reservations',
          HttpStatus.BAD_REQUEST,
        );
      }
      const deletedReservation = await this.database.booking.delete({
        where: {
          id: bookingId,
        },
      });
      return {
        data: deletedReservation,
        message: 'reservation has been deleted',
      };
    } catch (error) {
      // console.error(error);
      throw error;
    }
  }
  //get all reservations
  async findAllreservations() {
    try {
      const reservations = await this.database.booking.findMany({});
      return { data: reservations };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //get user all reservations
  async findUserAllReservations(request) {
    try {
      const reservations = await this.database.users.findUnique({
        where: {
          id: request.user.tokenId,
        },
        select: {
          booking: true,
        },
      });
      return { data: reservations };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
