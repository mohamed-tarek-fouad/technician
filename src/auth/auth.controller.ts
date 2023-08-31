/* eslint-disable prettier/prettier */
import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist';
import { JwtAuthGuard } from 'src/jwtAuthGuard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { ForgetPasswordDto } from './dtos/forgetPassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { Patch } from '@nestjs/common';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateTechDto } from './dtos/createTech.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }
  @Post('client/register')
  clientRegister(@Body() createUserDto: CreateUserDto) {
    return this.authService.clientRegister(createUserDto);
  }
  @UseInterceptors(
    FilesInterceptor('images', 1, {
      preservePath: true,
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|mov|avi|wmv)$/)) {
          return cb(
            new Error('Only image and video files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @Post('tech/register')
  register(
    @Body() createUserDto: CreateUserDto,
    techDto: CreateTechDto,
    @UploadedFiles() images: any,
  ) {
    return this.authService.techRegister(createUserDto, techDto, images);
  }
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req) {
    return this.authService.logout(req);
  }
  @Post('forgetPassword')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }
  @Post('resetPassword/:id/:token')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('id') id: string,
    @Param('token') token: string,
  ) {
    return this.authService.resetPassword(resetPasswordDto, id, token);
  }
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }
}
