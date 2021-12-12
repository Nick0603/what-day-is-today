import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { LineNotifySubscriber } from './entities/line-notify-subscriber.entity';
import { UsersService } from '../../users/users.service';
import { PathNotFoundError } from './lineNotify.exceptions';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import axios from 'axios';
import * as qs from 'qs';
import { isNil } from 'lodash';

@Injectable()
export class LineNotifyService {
  private readonly logger = new Logger(LineNotifyService.name);

  constructor(
    @InjectRepository(LineNotifySubscriber)
    private subscriberRepository: Repository<LineNotifySubscriber>,
    private userService: UsersService,
    private configService: ConfigService,
  ) {}

  private getRedirectUri(subscribedPath: string): string {
    const domain = this.configService.get<string>('SERVER_ORIGIN');
    const redirectUri = `${domain}/subscribe/line_notify/${subscribedPath}`;
    return redirectUri;
  }

  async getRedirectUrl(subscribedPath: string) {
    const user = await this.userService.findBySubscribedPath(subscribedPath);
    if (!user) {
      throw new PathNotFoundError(subscribedPath);
    }
    const clientId = this.configService.get<string>('LINE_CLIENT_ID');
    const redirectUri = this.getRedirectUri(subscribedPath);
    return `https://notify-bot.line.me/oauth/authorize?response_type=code&scope=notify&response_mode=form_post&client_id=${clientId}&redirect_uri=${redirectUri}&state=what-day-is-today`;
  }

  async subscribe(
    subscribedPath: string,
    dto: CreateSubscribeDto,
  ): Promise<{ subscriber: LineNotifySubscriber; subscribedUser: UserEntity }> {
    const user = await this.userService.findBySubscribedPath(subscribedPath);
    if (!user) {
      throw new PathNotFoundError(subscribedPath);
    }
    this.logger.debug(`[line-notify] subscribe code: ${dto.code}`);
    const data = qs.stringify({
      code: dto.code,
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('LINE_CLIENT_ID'),
      redirect_uri: this.getRedirectUri(subscribedPath),
      client_secret: this.configService.get<string>('LINE_CLIENT_SECRET'),
    });
    this.logger.debug(`[line notify] oauth data ${JSON.stringify(data)}`);
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const result: any = await axios
      .post('https://notify-bot.line.me/oauth/token', data, options)
      .catch((e) => {
        console.log(e);
        throw e;
      });
    const token = result.data.access_token;
    this.logger.debug(`[line notify] token: ${token}`);
    if (isNil(token)) {
      throw new Error('Invalid token');
    }
    const subscriber = this.subscriberRepository.create({
      subscribedUser: user,
      token,
    });
    await this.subscriberRepository.save(subscriber);
    return {
      subscriber,
      subscribedUser: user,
    };
  }

  async sendMessage(accessToken: string, message: string) {
    this.logger.debug(
      `[line-notify] send message(${message}) to ${accessToken}`,
    );
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const data = qs.stringify({ message });
    try {
      await axios.post('https://notify-api.line.me/api/notify', data, options);
    } catch (e) {
      this.logger.warn(e);
    }
  }

  async getAllActiveSubscribers(): Promise<LineNotifySubscriber[]> {
    const subscribers = await this.subscriberRepository.find({
      where: {
        isActive: true,
      },
      relations: ['subscribedUser'],
    });
    return subscribers;
  }

  async getAllActiveSubscribersForUser(
    user: UserEntity,
  ): Promise<LineNotifySubscriber[]> {
    const subscribers = await this.subscriberRepository.find({
      where: {
        isActive: true,
        subscribedUser: user,
      },
    });
    return subscribers;
  }

  async getAllActiveSubscriberByPath(
    path: string,
  ): Promise<LineNotifySubscriber[]> {
    const user = await this.userService.findBySubscribedPath(path);
    if (!user) {
      throw new PathNotFoundError(path);
    }
    const subscribers = await this.subscriberRepository.find({
      isActive: true,
      subscribedUser: user,
    });
    return subscribers;
  }
}
