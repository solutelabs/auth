import { OTP_OPTIONS } from 'src/core/constant';
export declare class SendOtpDto {
    contact: string;
    country_code: string;
    mode?: OTP_OPTIONS;
}
