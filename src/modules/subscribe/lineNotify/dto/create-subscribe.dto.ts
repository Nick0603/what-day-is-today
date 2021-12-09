import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSubscribeDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  readonly state: string;
}
