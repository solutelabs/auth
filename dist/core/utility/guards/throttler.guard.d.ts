import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
export declare class RestThrottlerGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext): {
        req: any;
        res: any;
    };
}
