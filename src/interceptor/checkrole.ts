import {
  Injectable,
  NestInterceptor,
  ForbiddenException,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleCheckInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to access');
    }

    return next.handle();
  }
}
