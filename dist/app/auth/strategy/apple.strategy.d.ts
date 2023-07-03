/// <reference types="passport-oauth2" />
import { VerifyCallback } from "passport-apple";
import { AuthService } from "../auth.service";
declare const AppleStrategy_base: new (...args: any[]) => import("passport-oauth2");
export declare class AppleStrategy extends AppleStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
export {};
