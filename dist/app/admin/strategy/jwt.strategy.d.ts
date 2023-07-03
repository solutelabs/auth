import { Strategy } from 'passport-jwt';
import { AuthService } from 'src/app/auth/auth.service';
import { UserEntity } from 'src/app/auth/entity';
import { ITokenPayload } from 'src/app/auth/interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: ITokenPayload): Promise<UserEntity>;
}
export {};
