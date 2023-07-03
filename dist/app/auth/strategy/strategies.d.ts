import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
declare const GoogleStrategy_base: new (...args: any[]) => Strategy;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
declare const FacebookOAuth2Strategy_base: new (...args: any[]) => any;
export declare class FacebookOAuth2Strategy extends FacebookOAuth2Strategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
declare const AppleOAuth2Strategy_base: new (...args: any[]) => import("passport-oauth2");
export declare class AppleOAuth2Strategy extends AppleOAuth2Strategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
declare const TwitterOAuth2Strategy_base: new (...args: any[]) => any;
export declare class TwitterOAuth2Strategy extends TwitterOAuth2Strategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(request: any, accessToken: string, refreshToken: string, profile: any, done: any): Promise<any>;
}
export {};
