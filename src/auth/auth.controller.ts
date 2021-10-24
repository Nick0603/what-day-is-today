import {
  Inject,
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  ConflictUserNameError,
  ConflictSubscribedPathError,
} from '../users/users.exceptions';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/local/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/local/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return this.authService.login(user);
    } catch (e) {
      this.logger.debug(e);
      if (
        e instanceof ConflictUserNameError ||
        e instanceof ConflictSubscribedPathError
      ) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            error: e.message,
          },
          HttpStatus.CONFLICT,
        );
      }
      throw e;
    }
  }
}
