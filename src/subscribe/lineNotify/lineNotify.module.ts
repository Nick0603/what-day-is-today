import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../users/users.module';
import { LineNotifyService } from './lineNotify.service';
import { LineNotifyController } from './lineNotify.controller';
import { LineNotifySubscriber } from './entities/line-notify-subscriber.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LineNotifySubscriber]),
    UsersModule,
    ConfigModule.forRoot(),
  ],
  controllers: [LineNotifyController],
  providers: [LineNotifyService],
  exports: [LineNotifyService],
})
export class LineNotifyModule {}
