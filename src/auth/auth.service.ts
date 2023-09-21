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
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { v2 as cloudinary } from 'cloudinary';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { CreateTechDto } from './dtos/createTech.dto';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';
import { VerifyPhoneNumberDto } from './dtos/verifyPhoneNumber.dto';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private database: DatabaseService,
    private mailerService: MailerService,
    private config: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }
  async validateUser(email: string, password: string) {
    try {
      const user = await this.database.users.findFirst({
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
  async validateToken(id: number) {
    try {
      const token = await this.database.tokens.findUnique({
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
      const token = await this.database.tokens.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });
      delete user.id;
      delete user.password;
      delete user.techncian[0]?.nationalId;
      delete user.techncian[0]?.userId;
      const tech = user.techncian[0] ? user.techncian[0] : [];
      delete user.techncian;
      return {
        message: 'loged in successfully',
        ...tech,
        ...user,
        access_token: this.jwtService.sign({
          user: { userId: user.id, role: user.role, tokenId: token.id },
        }),
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async clientRegister(userDto: CreateUserDto) {
    const userExist = await this.database.users.findFirst({
      where: {
        OR: [{ email: userDto.email }, { phoneNumber: userDto.phoneNumber }],
      },
    });
    if (userExist) {
      throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
    }
    const saltOrRounds = 10;
    userDto.password = await bcrypt.hash(userDto.password, saltOrRounds);
    const user = await this.database.users.create({
      data: userDto,
    });
    const token = await this.database.tokens.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    delete user.id;
    delete user.password;
    return {
      ...user,
      access_token: this.jwtService.sign({
        user: { userId: user.id, role: user.role, tokenId: token.id },
      }),
      message: 'user has been created successfully',
    };
  }
  async techRegister(techDto: CreateTechDto, images) {
    if (!images[0])
      throw new HttpException(
        'national Id image is required',
        HttpStatus.BAD_REQUEST,
      );
    const userExist = await this.database.users.findFirst({
      where: {
        OR: [{ email: techDto.email }, { phoneNumber: techDto.phoneNumber }],
      },
    });
    if (userExist) {
      throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
    }
    const saltOrRounds = 10;
    techDto.password = await bcrypt.hash(techDto.password, saltOrRounds);
    const user = await this.database.users.create({
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

    const tech = await this.database.techncian.create({
      data: {
        fullName: techDto.fullName,
        jobTitle: techDto.jobTitle,
        nationalId: techDto.nationalId,
        userId: user.id,
        idImage: url,
      },
    });
    const token = await this.database.tokens.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    delete user.password;
    delete user.id;
    delete tech.nationalId;
    return {
      ...user,
      ...tech,
      access_token: this.jwtService.sign({
        user: { userId: user.id, role: user.role, tokenId: token.id },
      }),
      message: 'user has been created successfully',
    };
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
      throw new HttpException(
        `error in upload image ${err}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async logout(req) {
    try {
      await this.database.tokens.delete({
        where: {
          id: req.user.tokenId,
        },
      });
      return { message: 'loged out successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyPhoneNumber(verifyPhoneNumber: VerifyPhoneNumberDto) {
    try {
      const user = await this.database.users.findUnique({
        where: { phoneNumber: verifyPhoneNumber.phoneNumber },
      });
      if (!user) {
        throw new HttpException(
          `no user with this phoneNUmber `,
          HttpStatus.BAD_REQUEST,
        );
      }
      const client = new Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTHTOKEN,
      );
      const fourDigits = Math.floor(Math.random() * 9000) + 1000;

      const secret = process.env.ACCESS_SECRET;
      const token = this.jwtService.sign(
        { code: fourDigits },
        {
          secret,
          expiresIn: 60 * 15,
        },
      );
      await this.database.users.update({
        where: { phoneNumber: verifyPhoneNumber.phoneNumber },
        data: {
          phoneNumberVerifiaction: token,
        },
      });
      try {
        await client.messages.create({
          body: `Verification Code Is : ${fourDigits}`,
          from: process.env.TWILIO_NUMBER,
          to: user.phoneNumber,
        });
      } catch (err) {
        console.error(err);
      }
      return { message: 'verification code sent successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyResetPassword(
    verifyPhoneNumber: VerifyPhoneNumberDto,
    token: string,
  ) {
    try {
      const user = await this.database.users.findUnique({
        where: { phoneNumber: verifyPhoneNumber.phoneNumber },
      });
      const secret = process.env.ACCESS_SECRET;
      const payload = await this.jwtService.verify(
        user.phoneNumberVerifiaction,
        {
          secret,
        },
      );
      if (payload.code != token) {
        throw new HttpException("user doesn't exist", HttpStatus.BAD_REQUEST);
      }
      return { message: 'valid numbers reset password now' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto, token: string) {
    try {
      const user = await this.database.users.findFirst({
        where: { phoneNumber: resetPasswordDto.phoneNumber },
      });
      const secret = process.env.ACCESS_SECRET;
      const payload = await this.jwtService.verify(
        user.phoneNumberVerifiaction,
        {
          secret,
        },
      );
      if (payload.code != token) {
        throw new HttpException("user doesn't exist", HttpStatus.BAD_REQUEST);
      }
      const saltOrRounds = 10;
      resetPasswordDto.password = await bcrypt.hash(
        resetPasswordDto.password,
        saltOrRounds,
      );
      const updatedUser = await this.database.users.update({
        where: { phoneNumber: resetPasswordDto.phoneNumber },
        data: {
          password: resetPasswordDto.password,
        },
      });
      delete user.password;
      return { ...updatedUser, message: 'reset password successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.database.users.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw new HttpException("user doesn't exist", HttpStatus.BAD_REQUEST);
      }
      const updatedUser = await this.database.users.update({
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
      const expiredTokens = await this.database.tokens.findMany({
        where: {
          expiresAt: {
            lte: new Date(),
          },
        },
      });
      if (expiredTokens.length > 0) {
        console.log(`Found ${expiredTokens.length} expired tokens`);
        for (const token of expiredTokens) {
          await this.database.tokens.delete({
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
