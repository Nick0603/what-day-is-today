"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RoleGuard = void 0;
var common_1 = require("@nestjs/common");
var enum_1 = require("../users/constants/enum");
var lodash_1 = require("lodash");
// export const RoleGuard = (role: UserRole): any => {
//   @Injectable()
//   class RoleGuardMixin implements CanActivate {
//     private readonly logger = new Logger(RoleGuardMixin.name);
//     canActivate(@Request() req: any): boolean {
//       const user: User = req.user;
//       this.logger.debug(JSON.stringify(req));
//       if (isNil(user)) {
//         throw new UnauthorizedException();
//       }
//       if (user.role !== role) {
//         throw new ForbiddenException();
//       }
//       this.logger.debug(`checked: userID: ${user.id}, role: ${role}.`);
//       return user.role === role;
//     }
//   }
//   const guard = mixin(RoleGuardMixin);
//   return guard;
// };
var RoleGuard = /** @class */ (function () {
    function RoleGuard() {
        this.logger = new common_1.Logger(RoleGuard_1.name);
    }
    RoleGuard_1 = RoleGuard;
    RoleGuard.prototype.canActivate = function (context) {
        var req = context.switchToHttp().getRequest();
        var user = req.user;
        this.logger.debug(user);
        if (lodash_1.isNil(user)) {
            throw new common_1.UnauthorizedException();
        }
        if (user.role !== enum_1.UserRole.admin) {
            throw new common_1.ForbiddenException();
        }
        this.logger.debug("checked: userID: " + user.id + ", role: " + user.role + ".");
        return true;
    };
    var RoleGuard_1;
    RoleGuard = RoleGuard_1 = __decorate([
        common_1.Injectable()
    ], RoleGuard);
    return RoleGuard;
}());
exports.RoleGuard = RoleGuard;
