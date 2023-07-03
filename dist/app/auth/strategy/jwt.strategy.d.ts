import { Strategy } from 'passport-jwt';
import { ITokenPayload } from '../interface';
import { UserEntity } from '../entity';
import { AuthService } from '../auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: ITokenPayload): Promise<UserEntity>;
}
export {};
