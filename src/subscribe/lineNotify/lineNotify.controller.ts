import {
  Controller,
  Get,
  Body,
  Post,
  HttpException,
  HttpStatus,
  Param,
  Res,
  Inject,
} from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { PathNotFoundError } from './lineNotify.exceptions';
import { LineNotifyService } from './lineNotify.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as moment from 'moment';

@Controller('subscribe/line_notify')
export class LineNotifyController {
  constructor(
    private readonly lineNotifyService: LineNotifyService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get(':path/redirect')
  async redirectToAuth(@Param('path') path, @Res() res) {
    try {
      const redirectUrl = await this.lineNotifyService.getRedirectUrl(path);
      this.logger.debug(`[line-notify] redirect to ${redirectUrl}`);
      return res.redirect(redirectUrl);
    } catch (e) {
      if (e instanceof PathNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: e.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }

  @Post(':path')
  async update(
    @Param('path') path,
    @Body() createSubscribeDto: CreateSubscribeDto,
  ) {
    const { subscriber, subscribedUser } =
      await this.lineNotifyService.subscribe(path, createSubscribeDto);
    const anniversary = moment([
      subscribedUser.anniversaryDate.getFullYear(),
      subscribedUser.anniversaryDate.getMonth(),
      subscribedUser.anniversaryDate.getDate(),
    ]);
    const message = `歡迎訂閱 ${
      subscribedUser.username
    } 的通知，交往日是 ${anniversary.calendar()}`;
    await this.lineNotifyService.sendMessage(subscriber.token, message);
    return 'success';
  }
}
