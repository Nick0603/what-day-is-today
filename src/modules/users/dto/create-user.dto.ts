import { IsString, IsNotEmpty, MinLength, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsString()
  @MinLength(8, {
    message: 'password is too short',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly subscribedPath: string;

  @Type(() => Date)
  @IsDate()
  readonly anniversaryDate: string;
}
