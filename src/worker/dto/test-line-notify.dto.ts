import { IsString, IsNotEmpty, MinLength, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class TestLineNotifyDto {
  @IsNotEmpty()
  @IsString()
  readonly workerToken: string;

  @IsNotEmpty()
  @IsString()
  readonly message: string;
}
