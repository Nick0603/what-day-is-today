import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Notification } from './entities/notification.entity';
import { UsersService } from '../users/users.service';
import { TotalHeaderInterceptor } from '../../interceptors/total-header.interceptor';
import { map } from 'lodash';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  @UseInterceptors(TotalHeaderInterceptor)
  async findAll() {
    const notifications = await this.notificationsService.findAll();
    const transformedNotifications = map(notifications, (noti) => {
      noti.scheduleAt *= 1000;
      return noti;
    });
    return transformedNotifications;
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    const notification = await this.notificationsService.findOne(id);
    notification.scheduleAt *= 1000;
    return notification;
  }

  @Put('/:id')
  async UpdateOne(@Param('id') id: number, @Body() dto: UpdateNotificationDto) {
    const notification = await this.notificationsService.updateOne(id, dto);
    return notification;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async findMe(
    @Request() req: any,
    @Body() dto: CreateNotificationDto,
  ): Promise<Notification> {
    const user = await this.usersService.findOne(req.user.id);
    dto.user = user;
    const notification = await this.notificationsService.create(dto);
    return notification;
  }
}
