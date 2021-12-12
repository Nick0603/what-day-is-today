import { IsString, IsNotEmpty } from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';

export class UpdateNotificationDto {
  user: UserEntity;

  @IsNotEmpty()
  @IsString()
  readonly message: string;

  readonly scheduleAt: number | string;

  readonly isPushed: boolean;
}
