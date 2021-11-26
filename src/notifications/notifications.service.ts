import { Injectable } from '@nestjs/common';
import { LessThan } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const entity = this.notificationRepository.create(createNotificationDto);
    await this.notificationRepository.save(entity);
    return entity;
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  async findOne(id: number): Promise<Notification> {
    return this.notificationRepository.findOne(id);
  }

  private getNowInSecondFormat(): number {
    return Math.floor(Date.now() / 1000);
  }
  async handleActiveAndNoPushed(): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({
      relations: ['user'],
      where: {
        scheduleAt: LessThan(this.getNowInSecondFormat()),
        isPushed: false,
      },
    });
    await this.notificationRepository.update(
      {
        scheduleAt: LessThan(this.getNowInSecondFormat()),
        isPushed: false,
      },
      {
        isPushed: true,
      },
    );

    return notifications;
  }
}
