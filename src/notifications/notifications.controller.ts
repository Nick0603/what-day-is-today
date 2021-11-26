import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Notification } from './entities/notification.entity';
import { UsersService } from '../users/users.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
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
