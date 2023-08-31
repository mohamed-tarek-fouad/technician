import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from './../prisma.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, CacheModule],
})
export class UsersModule {}
