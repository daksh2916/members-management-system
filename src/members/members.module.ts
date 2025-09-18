import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { S3Service } from '../s3/s3.service';

@Module({
  controllers: [MembersController],
  providers: [MembersService, PrismaService, RedisService, S3Service],
  exports: [MembersService],
})
export class MembersModule {}
    