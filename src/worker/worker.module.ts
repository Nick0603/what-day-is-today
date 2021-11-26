import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LineNotifyModule } from '../subscribe/lineNotify/lineNotify.module';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [ConfigModule.forRoot(), LineNotifyModule],
  controllers: [WorkerController],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
