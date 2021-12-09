import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { NotificationsService } from '../../modules/notifications/notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from '../../modules/notifications/entities/notification.entity';
import { UsersService } from '../../modules/users/users.service';
import { TotalHeaderInterceptor } from '../../interceptors/total-header.interceptor';
import { map } from 'lodash';

@Controller('admin/notifications')
export class AdminNotificationsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  @UseInterceptors(TotalHeaderInterceptor)
  async findAll() {
    const notifications = await this.notificationsService.findAll();
    const transformedNotifications = map(notifications, (notification) => {
      notification.scheduleAt *= 1000;
      return notification;
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

  @Post()
  async create(@Body() dto: CreateNotificationDto): Promise<Notification> {
    const user = await this.usersService.findOne(dto.userId);
    dto.user = user;
    const notification = await this.notificationsService.create({
      user: dto.user,
      message: dto.message,
      type: dto.type,
      scheduleAt: new Date(dto.scheduleAt).getTime(),
    });
    return notification;
  }
}
