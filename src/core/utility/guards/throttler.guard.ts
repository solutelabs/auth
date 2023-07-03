import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class RestThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest();
    const response = httpCtx.getResponse();
    return { req: request, res: response };
  }
}