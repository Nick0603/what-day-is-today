import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { TotalHeaderInterceptor } from '../../interceptors/total-header.interceptor';
import { JwtAuthGuard } from '../../modules/auth/jwt-auth.guard';
import { RoleGuard } from '../../modules/auth/role.guard';
import { UserRole } from '../../modules/users/constants/enum';

@UseInterceptors(TotalHeaderInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard(UserRole.admin))
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }
}
