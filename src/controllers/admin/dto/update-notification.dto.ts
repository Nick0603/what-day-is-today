import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateNotificationDto {
  @IsNotEmpty()
  @IsString()
  readonly message: string;

  readonly scheduleAt: number | string;

  readonly isPushed: boolean;
}
