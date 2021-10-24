import { Module } from '@nestjs/common';
import { LineNotifyModule } from './lineNotify/lineNotify.module';

@Module({
  imports: [LineNotifyModule],
})
export class SubscribeModule {}
