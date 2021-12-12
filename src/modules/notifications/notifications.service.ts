import { Injectable } from '@nestjs/common';
import { LessThan } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const scheduleAt = Math.floor(dto.scheduleAt / 1000);
    const entity = this.notificationRepository.create({
      ...dto,
      scheduleAt,
    });
    await this.notificationRepository.save(entity);
    return entity;
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  async findOne(id: number): Promise<Notification> {
    return this.notificationRepository.findOne(id);
  }

  async updateOne(
    id: number,
    dto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.message = dto.message;
    notification.isPushed = dto.isPushed;
    if (dto.user) {
      notification.user = dto.user;
    }
    if (typeof dto.scheduleAt === 'string') {
      notification.scheduleAt = Math.floor(
        new Date(dto.scheduleAt).getTime() / 1000,
      );
    } else {
      notification.scheduleAt = Math.floor(dto.scheduleAt / 1000);
    }
    await this.notificationRepository.save(notification);
    return notification;
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
