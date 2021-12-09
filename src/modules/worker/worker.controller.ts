import {
  Controller,
  Post,
  Body,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { TestLineNotifyDto } from './dto/test-line-notify.dto';
import { WorkerAuthGuard } from './guard/worker-auth.guard';

@Controller('worker')
@UseGuards(WorkerAuthGuard)
export class WorkerController {
  private readonly logger = new Logger(WorkerController.name);

  constructor(private readonly workerService: WorkerService) {}

  @Post('trigger/line_notify')
  async triggerLineNotify() {
    await this.workerService.triggerDailyLineNotify();
    return 'success';
  }

  @Post('test/line_notify/:path')
  async testLineNotify(
    @Body() testDto: TestLineNotifyDto,
    @Param('path') path,
  ) {
    await this.workerService.debugLineNotify(path, testDto.message);
    return 'success';
  }

  @Post('trigger/schedule_notifications')
  async triggerScheduleNotifications() {
    await this.workerService.triggerScheduleNotifications();
    return 'success';
  }
}
