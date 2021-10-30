import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkerService } from './worker.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestLineNotifyDto } from './dto/test-line-notify.dto';

@Controller('worker')
export class WorkerController {
  constructor(
    private readonly workerService: WorkerService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('trigger/line_notify')
  async triggerLineNotify(@Body('workerToken') token) {
    const correctToken = this.configService.get<string>('WORKER_TOKEN');
    if (token !== correctToken) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.workerService.triggerDailyLineNotify();
    return 'success';
  }

  @Post('test/line_notify/:path')
  async testLineNotify(
    @Body() testDto: TestLineNotifyDto,
    @Param('path') path,
  ) {
    const correctToken = this.configService.get<string>('WORKER_TOKEN');
    if (testDto.workerToken !== correctToken) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.workerService.debugLineNotify(path, testDto.message);
    return 'success';
  }
}
