/* eslint-disable prettier/prettier */
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './../prisma.service';
import { CreateUserDto } from './dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { ForgetPasswordDto } from './dtos/forgetPassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { v2 as cloudinary } from 'cloudinary';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { CreateTechDto } from './dtos/createTech.dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtServise: JwtService,
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }
  async validateUser(email: string, password: string) {
    try {
      const user = await this.prisma.users.findFirst({
        where: { OR: [{ email }, { phoneNumber: email }] },
        include: { techncian: true },
      });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return user;
        }
      }
      return null;
    } catch (err) {
      return err;
    }
  }
  async validateToken(id: string) {
    try {
      const token = await this.prisma.tokens.findUnique({
        where: {
          id,
        },
      });
      return token;
    } catch (err) {
      return err;
    }
  }
  async login(user: any): Promise<any> {
    try {
      const token = await this.prisma.tokens.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });
      delete user.id;
      delete user.password;
      delete user.techncian[0].nationalId;
      delete user.techncian[0].userId;
      const tech = user.techncian[0] ? user.techncian[0] : [];
      delete user.techncian;
      return {
        message: 'loged in successfully',
        ...tech,
        ...user,
        access_token: this.jwtServise.sign({
          user: { userId: user.id, role: user.role, tokenId: token.id },
        }),
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async clientRegister(userDto: CreateUserDto) {
    try {
      const userExist = await this.prisma.users.findFirst({
        where: {
          OR: [{ email: userDto.email }, { phoneNumber: userDto.phoneNumber }],
        },
      });
      if (userExist) {
        throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
      }
      const saltOrRounds = 10;
      userDto.password = await bcrypt.hash(userDto.password, saltOrRounds);
      const user = await this.prisma.users.create({
        data: userDto,
      });
      delete user.id;
      delete user.password;
      return { ...user, message: 'user has been created successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async techRegister(techDto: CreateTechDto, images) {
    try {
      if (!images[0])
        throw new HttpException(
          'national Id image is required',
          HttpStatus.BAD_REQUEST,
        );
      const userExist = await this.prisma.users.findFirst({
        where: {
          OR: [{ email: techDto.email }, { phoneNumber: techDto.phoneNumber }],
        },
      });
      if (userExist) {
        throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
      }
      const saltOrRounds = 10;
      techDto.password = await bcrypt.hash(techDto.password, saltOrRounds);
      const user = await this.prisma.users.create({
        data: {
          email: techDto.email,
          gender: techDto.gender,
          government: techDto.government,
          password: techDto.password,
          phoneNumber: techDto.phoneNumber,
          username: techDto.username,
        },
      });
      const url = await this.uploadImage(images[0].buffer);

      const tech = await this.prisma.techncian.create({
        data: {
          fullName: techDto.fullName,
          jobTitle: techDto.jobTitle,
          nationalId: techDto.nationalId,
          userId: user.id,
          idImage: url,
        },
      });
      delete user.password;
      delete user.id;
      delete tech.nationalId;
      return {
        ...user,
        ...tech,
        message: 'user has been created successfully',
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async uploadImage(buffer: Buffer): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          })
          .end(buffer);
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async logout(req) {
    try {
      await this.prisma.tokens.delete({
        where: {
          id: req.user.tokenId,
        },
      });
      return { message: 'loged out successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    try {
      const validateUser = await this.prisma.users.findUnique({
        where: {
          email: forgetPasswordDto.email,
        },
      });
      if (!validateUser) {
        throw new HttpException("email doesn't exist", HttpStatus.BAD_REQUEST);
      }

      const secret = process.env.ACCESS_SECRET + validateUser.password;
      const token = this.jwtServise.sign(
        { email: forgetPasswordDto.email, id: validateUser.id },
        {
          secret,
          expiresIn: 60 * 15,
        },
      );

      const url = `http://localhost:3001/auth/resetPassword/${validateUser.id}/${token}`;

      await this.mailerService.sendMail({
        to: forgetPasswordDto.email,
        from: process.env.EMAIL_USER,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Reset Password Confirmation Email',
        //template: "./templates/confirmation", // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: validateUser.username,
          url,
        },

        text: url,
      });
      return { message: 'email sent successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    id: string,
    token: string,
  ) {
    try {
      const validateUser = await this.prisma.users.findUnique({
        where: {
          id,
        },
      });
      if (!validateUser) {
        throw new HttpException("user doesn't exist", HttpStatus.BAD_REQUEST);
      }
      const secret = process.env.ACCESS_SECRET + validateUser.password;
      const payload = this.jwtServise.verify(token, { secret });
      if (payload.id !== validateUser.id) {
        throw new HttpException("user doesn't exist", HttpStatus.BAD_REQUEST);
      }
      const saltOrRounds = 10;
      resetPasswordDto.password = await bcrypt.hash(
        resetPasswordDto.password,
        saltOrRounds,
      );
      const user = await this.prisma.users.update({
        where: { id },
        data: {
          password: resetPasswordDto.password,
        },
      });
      delete user.password;
      return { ...user, message: 'reset password successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw new HttpException("user doesn't exist", HttpStatus.BAD_REQUEST);
      }
      console.log(updateUserDto);
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: updateUserDto,
      });
      delete updatedUser.password;
      return { ...updatedUser, message: 'user updated successfully' };
    } catch (err) {
      return err;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async deleteExpiredTokens() {
    try {
      console.log('Checking for expired tokens...');
      const expiredTokens = await this.prisma.tokens.findMany({
        where: {
          expiresAt: {
            lte: new Date(),
          },
        },
      });
      if (expiredTokens.length > 0) {
        console.log(`Found ${expiredTokens.length} expired tokens`);
        for (const token of expiredTokens) {
          await this.prisma.tokens.delete({
            where: {
              id: token.id,
            },
          });
        }
        console.log('Deleted expired tokens');
      } else {
        console.log('No expired tokens found');
      }
    } catch (err) {
      return err;
    }
  }
}
