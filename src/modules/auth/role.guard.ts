import {
  CanActivate,
  Logger,
  UnauthorizedException,
  ForbiddenException,
  ExecutionContext,
  mixin,
} from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../users/constants/enum';
import { isNil } from 'lodash';

export const RoleGuard = (role: UserRole): any => {
  class RoleGuardMixin implements CanActivate {
    private readonly logger = new Logger(RoleGuard.name);

    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      const user: UserEntity = req.user;
      this.logger.debug(
        `[role guard] userId: ${user.id}, userRole: ${user.role}, matchedRole: ${role}`,
      );
      if (isNil(user)) {
        throw new UnauthorizedException();
      }
      if (user.role !== role) {
        throw new ForbiddenException();
      }
      return true;
    }
  }
  const guard = mixin(RoleGuardMixin);
  return guard;
};
