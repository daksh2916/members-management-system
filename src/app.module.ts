import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { MembersModule } from './members/members.module';
import { EventsModule } from './events/events.module';
import { RedisModule } from './redis/redis.module';
import { S3Module } from './s3/s3.module';
import { exec, execSync } from 'child_process';
@Module({
  imports: [MembersModule, EventsModule, RedisModule, S3Module],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    try {
      console.log('Running database migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });

      console.log('Database migrations completed successfully.');
    } catch (error) {
      console.error('Error running database migrations:', error);
      process.exit(1); // Exit the application if migrations fail
    } 
  }
}
