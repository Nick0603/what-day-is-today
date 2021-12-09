import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TotalHeaderInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map((data) => {
        const req = context.switchToHttp().getRequest();
        req.res.header('Access-Control-Expose-Headers', 'X-Total-Count');
        req.res.header('X-Total-Count', `${data.length}`);
        return data;
      }),
    );
  }
}
