import { PrismaService } from '../prisma.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async allUsers() {
    try {
      const users = await this.prisma.users.findMany({});
      if (users.length === 0) {
        throw new HttpException("user does'nt exist", HttpStatus.BAD_REQUEST);
      }

      return { user: users, message: 'fetched all users successfully' };
    } catch (err) {
      return err;
    }
  }

  async userById(id: string) {
    try {
      const userFound = await this.prisma.users.findUnique({
        where: {
          id,
        },
      });
      if (!userFound) {
        throw new HttpException(
          "this user does'nt exist",
          HttpStatus.BAD_REQUEST,
        );
      }

      delete userFound.password;

      return { user: userFound, message: 'user fetched successfully' };
    } catch (err) {
      return err;
    }
  }
}
