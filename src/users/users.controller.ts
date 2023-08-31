import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../jwtAuthGuard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('allUsers')
  allUsers() {
    return this.usersService.allUsers();
  }
  @Get(':id')
  userById(@Param('id') id: string) {
    return this.usersService.userById(id);
  }
}
