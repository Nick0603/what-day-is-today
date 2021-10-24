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
    await this.lineNotifyService.subscribe(path, createSubscribeDto);
    return 'success';
  }
}
