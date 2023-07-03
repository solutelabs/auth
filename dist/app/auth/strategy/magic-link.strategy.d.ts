import { Strategy } from 'passport-jwt';
import { ITokenPayload } from '../interface';
import { UserEntity } from '../entity';
import { AuthService } from '../auth.service';
declare const MagicLinkStrategy_base: new (...args: any[]) => Strategy;
export declare class MagicLinkStrategy extends MagicLinkStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: ITokenPayload): Promise<UserEntity>;
}
export {};
