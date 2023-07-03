import { Repository } from 'typeorm';
import { OtpEntity } from './entity';
import { SendOtpDto, ValidateOtpDto } from './dto';
import { CountryService } from '../../country/country.service';
import { ClientProxy } from '@nestjs/microservices';
import { OTP_OPTIONS } from 'src/core/constant';
import { AuthService } from '../auth.service';
import { CommonResponse } from 'src/app/utility/model';
export declare class OtpService {
    private otpRepository;
    private countryService;
    private authService;
    private readonly client;
    private twilioClient;
    constructor(otpRepository: Repository<OtpEntity>, countryService: CountryService, authService: AuthService, client: ClientProxy);
    createAndSendOtp(data: SendOtpDto): Promise<CommonResponse>;
    generate(secret: string): Promise<string>;
    validate(token: string, secret: string): Promise<boolean>;
    verifyOtp(data: ValidateOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    sendOtpSMS(mobile_number: any, otp: string, mode: OTP_OPTIONS): Promise<void>;
    createAndSendWhatsAppOtp(data: SendOtpDto): Promise<CommonResponse>;
}
