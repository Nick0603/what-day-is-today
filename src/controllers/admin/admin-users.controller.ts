import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { TotalHeaderInterceptor } from '../../interceptors/total-header.interceptor';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseInterceptors(TotalHeaderInterceptor)
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }
}
