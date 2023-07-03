import { AuthService } from './auth.service';
import { LoginDto, MagicLinkDto, MobileDto, SignupDto } from './dto';
import { UserEntity } from './entity';
import { MagicLinkResponse } from './model';
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    signup(data: SignupDto): Promise<import("./interface").IAuthResponse>;
    login(data: LoginDto): Promise<import("./interface").IAuthResponse>;
    generateMagicLink(data: MagicLinkDto): Promise<MagicLinkResponse>;
    loginViaMagicLink(token: string): Promise<import("./interface").IAuthResponse>;
    signupMobile(data: MobileDto): Promise<import("./interface").IAuthResponse>;
    loginMobile(data: MobileDto): Promise<import("./interface").IAuthResponse>;
    updateContact(user: UserEntity, data: MobileDto): Promise<import("./interface").IAuthResponse>;
    refreshToken(refreshToken: string): Promise<import("./interface").IAuthResponse>;
}
