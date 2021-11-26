import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WorkerAuthGuard implements CanActivate {
  private readonly logger = new Logger(WorkerAuthGuard.name);
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = req.body.workerToken;
    const correctToken = this.configService.get<string>('WORKER_TOKEN');
    if (token !== correctToken) {
      return false;
    }
    return true;
  }
}
