import { IsString, IsNotEmpty } from 'class-validator';
import { UserEntity } from '../../../modules/users/entities/user.entity';

export class UpdateNotificationDto {
  readonly userId: number;
  user: UserEntity;

  @IsNotEmpty()
  @IsString()
  readonly message: string;

  readonly scheduleAt: number | string;

  readonly isPushed: boolean;
}
