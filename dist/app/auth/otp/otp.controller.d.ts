import { UserEntity } from "../entity";
import { SendOtpDto } from "./dto";
import { OtpService } from "./otp.service";
export declare class OtpController {
    private readonly otpService;
    constructor(otpService: OtpService);
    sendOtp(data: SendOtpDto): Promise<any>;
    whatsappSendOtp(data: SendOtpDto): Promise<any>;
    generateVerifyOtp(user: UserEntity): Promise<import("../../utility/model").CommonResponse>;
    verifyOtp(user: UserEntity, otp: string): Promise<{
        success: boolean;
        message: string;
    }>;
    generateUpdateOtp(dtoData: SendOtpDto): Promise<import("../../utility/model").CommonResponse>;
}
