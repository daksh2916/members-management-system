import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  member: any;
  constructor() {
  
    super({
      errorFormat: 'minimal',
    });

  
    this.$extends({
      model: {
        member: {},
        membershipInfo: {},
        businessInfo: {},
        bankingInfo: {},
        event: {},
        memberEvent: {},
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Connected to the database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Disconnected from the database');
  }
}
