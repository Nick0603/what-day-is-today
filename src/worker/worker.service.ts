import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { LineNotifyService } from '../subscribe/lineNotify/lineNotify.service';
import { forEach, filter } from 'lodash';
import * as moment from 'moment';
import { NotificationsService } from '../notifications/notifications.service';
import { Notification } from '../notifications/entities/notification.entity';
import { NotificationType } from '../notifications/constants/enum';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    private lineNotifyService: LineNotifyService,
    private notificationService: NotificationsService,
  ) {}

  async triggerDailyLineNotify() {
    const subscribers = await this.lineNotifyService.getAllActiveSubscribers();
    this.logger.debug(
      `[worker daily line-notify] subscribers: ${JSON.stringify(subscribers)}`,
    );
    forEach(subscribers, async (sub) => {
      const user: User = sub.subscribedUser;
      const anniversaryDate = user.anniversaryDate;
      const anniversary = moment([
        anniversaryDate.getFullYear(),
        anniversaryDate.getMonth(),
        anniversaryDate.getDate(),
      ]);
      this.logger.debug(
        `[worker daily line-notify] anniversaryDate: ${anniversary}`,
      );
      const dateDiff = moment().diff(anniversary, 'days');
      const message = `今天是我們交往第 ${Number(
        dateDiff,
      )} 天，謝謝有你讓我每天都很開心 ~`;
      await this.lineNotifyService.sendMessage(sub.token, message);
    });
  }

  async triggerScheduleNotifications(): Promise<string> {
    const notifications =
      await this.notificationService.handleActiveAndNoPushed();
    this.logger.debug(
      `[worker schedule notification] notifications: ${JSON.stringify(
        notifications,
      )}`,
    );
    const lineNotifyNotifications = filter(
      notifications,
      (noti) => noti.type === NotificationType.lineNotify,
    );
    await Promise.all([
      lineNotifyNotifications.map(async (notification: Notification) => {
        const user = notification.user;
        const subscribers =
          await this.lineNotifyService.getAllActiveSubscribersForUser(user);
        return Promise.all(
          subscribers.map(async (sub) => {
            this.logger.debug(
              `[worker schedule notification] to: ${sub.id}, message: ${notification.message}`,
            );
            await this.lineNotifyService.sendMessage(
              sub.token,
              notification.message,
            );
          }),
        );
      }),
    ]);
    return 'success';
  }

  async debugLineNotify(path: string, message: string) {
    const subscribers =
      await this.lineNotifyService.getAllActiveSubscriberByPath(path);
    forEach(subscribers, async (sub) => {
      await this.lineNotifyService.sendMessage(sub.token, message);
    });
  }
}
