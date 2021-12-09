import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConflictSubscribedPathError } from './users.exceptions';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMe(@Request() req: any) {
    const user = this.usersService.findOne(req.user.id);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    try {
      await this.usersService.update(req.user.id, updateUserDto);
      return 'success';
    } catch (e) {
      if (e instanceof ConflictSubscribedPathError) {
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

  @UseGuards(JwtAuthGuard)
  @Patch('reset_password')
  async resetPassword(
    @Request() req: any,
    @Body() resetPasswordUserDto: ResetPasswordUserDto,
  ) {
    await this.usersService.updatePassword(
      req.user,
      resetPasswordUserDto.password,
    );
    return 'success';
  }
}
