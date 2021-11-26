import { IsString, IsNotEmpty } from 'class-validator';

export class TestLineNotifyDto {
  @IsNotEmpty()
  @IsString()
  readonly message: string;
}
