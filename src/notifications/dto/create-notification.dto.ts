import { User } from '../../users/entities/user.entity';
import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { NotificationType } from '../constants/enum';

export class CreateNotificationDto {
  user: User;

  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @IsEnum(NotificationType)
  readonly type: NotificationType;

  @IsNumber()
  readonly scheduleAt: number;
}
