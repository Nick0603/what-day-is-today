import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { LineNotifyService } from '../subscribe/lineNotify/lineNotify.service';
import { forEach } from 'lodash';
import * as moment from 'moment';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(private lineNotifyService: LineNotifyService) {}

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

  async debugLineNotify(path: string, message: string) {
    const subscribers =
      await this.lineNotifyService.getAllActiveSubscriberByPath(path);
    forEach(subscribers, async (sub) => {
      await this.lineNotifyService.sendMessage(sub.token, message);
    });
  }
}
