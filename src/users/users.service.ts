import { DatabaseService } from 'src/database/database.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) {}
  async allUsers() {
    try {
      const users = await this.database.users.findMany({});
      if (users.length === 0) {
        throw new HttpException("user does'nt exist", HttpStatus.BAD_REQUEST);
      }

      return { user: users, message: 'fetched all users successfully' };
    } catch (err) {
      return err;
    }
  }

  async userById(id: number) {
    try {
      const userFound = await this.database.users.findUnique({
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
