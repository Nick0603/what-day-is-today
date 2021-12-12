import { UserEntity } from '../../../modules/users/entities/user.entity';
import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';
import { NotificationType } from '../../../modules/notifications/constants/enum';

export class CreateNotificationDto {
  user: UserEntity;

  @IsNotEmpty()
  @IsInt()
  readonly userId: number;

  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @IsEnum(NotificationType)
  readonly type: NotificationType;

  @IsString()
  readonly scheduleAt: string;
}
