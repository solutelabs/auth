import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { totp } from 'otplib';
import { Repository } from 'typeorm';
import * as randomString from 'randomstring';
import { OtpEntity } from './entity';
import { SendOtpDto, ValidateOtpDto } from './dto';
import {
  INVALID_COUNTRY_CODE,
  INVALID_OTP,
  UNAUTHORIZED,
  USER_NOT_FOUND,
} from '../../../core/error';
import { CountryService } from '../../country/country.service';
import { ClientProxy } from '@nestjs/microservices';
import { OTP_OPTIONS, PROVIDERS } from 'src/core/constant';
import { AuthService } from '../auth.service';
import { CommonResponse } from 'src/app/utility/model';
import { Twilio } from 'twilio';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } from 'src/core/environment';
totp.options = { digits: 6, window: 1, step: 60 };

@Injectable()
export class OtpService {
  private twilioClient: Twilio;
  constructor(
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private countryService: CountryService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject('MESSAGE_SERVICE') private readonly client: ClientProxy,
  ) {
    this.twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  async createAndSendOtp(data: SendOtpDto): Promise<CommonResponse> {
    const { contact, country_code, mode } = data;

    //check user already exists
    if (mode === OTP_OPTIONS.SIGNUP || mode === OTP_OPTIONS.UPDATE) {
      await this.authService.validateUserContact(contact);
    } else if (mode === OTP_OPTIONS.LOGIN || mode === OTP_OPTIONS.VERIFY) {
      const user = await this.authService.findByContact(contact);

      if (!user) {
        throw new NotFoundException('User not found', USER_NOT_FOUND);
      }

      if (!user.is_active) {
        throw new UnauthorizedException(
          'You are not authorized to access',
          UNAUTHORIZED,
        );
      }
    }

    const country = await this.countryService.findById(country_code);

    if (!country) {
      throw new NotFoundException('Invalid Country code', INVALID_COUNTRY_CODE);
    }

    const otpSecret = await randomString.generate(32);

    const payload = {
      otp_secret: otpSecret,
      contact: country_code + contact,
    };

    const otpCode = await this.generate(otpSecret);

    // call sendOtpSMS
    await this.sendOtpSMS(payload.contact, otpCode, mode);

    await this.otpRepository.save(payload);

    return {
      success: true,
      message: `Otp sent successfully. Your otp is ${otpCode}`,
    };
  }

  async generate(secret: string) {
    return totp.generate(secret);
  }

  async validate(token: string, secret: string) {
    return totp.check(token, secret);
  }

  async verifyOtp(data: ValidateOtpDto) {
    const { contact, otp, country_code } = data;

    const country = await this.countryService.findById(country_code);

    if (!country) {
      throw new NotFoundException('Invalid Country code', INVALID_COUNTRY_CODE);
    }

    const otpData = await this.otpRepository.find({
      where: { contact: country_code+ contact, otp_verified_at: null },
      order: { created_at: 'DESC' },
      take: 1,
    });

    if (!otpData.length) {
      throw new NotFoundException('Invalid OTP', INVALID_OTP);
    }

    const isValidOtp = await this.validate(otp, otpData[0].otp_secret);

    if (!isValidOtp) {
      throw new BadRequestException('Invalid otp', INVALID_OTP);
    }

    const verified_at = new Date().toISOString();
    await this.otpRepository.update(
      { id: otpData[0].id },
      { otp_verified_at: verified_at },
    );

    return {
      success: true,
      message: 'Otp verified successfully',
    };
  }

  async sendOtpSMS(mobile_number: any, otp: string, mode: OTP_OPTIONS) {
    let message = `Hi, use this OTP ${otp} to login to your xxxx account.`;

    if (mode === OTP_OPTIONS.SIGNUP)
      message = `Your xxxx OTP is ${otp}. Please enter this code in the app to complete your registration.`;
    if (mode === OTP_OPTIONS.VERIFY)
      message = `Your xxxx OTP is ${otp}. Please enter this code in the app to verify your number.`;
    if (mode === OTP_OPTIONS.UPDATE)
      message = `Your xxxx OTP is ${otp}. Please enter this code in the app to update your number.`;

    this.client.emit('message:send', {
      to: mobile_number,
      message: message,
    });
  }

  async createAndSendWhatsAppOtp(data: SendOtpDto): Promise<CommonResponse> {
    const { mode,country_code,contact } = data;
    if (mode === OTP_OPTIONS.SIGNUP || mode === OTP_OPTIONS.UPDATE) {
      await this.authService.validateUserContact(contact);
    } else if (mode === OTP_OPTIONS.LOGIN || mode === OTP_OPTIONS.VERIFY) {
      const user = await this.authService.findByContact(contact);

      if (!user) {
        throw new NotFoundException('User not found', USER_NOT_FOUND);
      }

      if (!user.is_active) {
        throw new UnauthorizedException(
          'You are not authorized to access',
          UNAUTHORIZED,
        );
      }
      if(user.provider !== PROVIDERS.WHATSAPP){
        throw new UnauthorizedException('User registered with different provider');
      }
    }

    const country = await this.countryService.findById(country_code);

    if (!country) {
      throw new NotFoundException('Invalid Country code', INVALID_COUNTRY_CODE);
    }
    const otpResponse = await this.twilioClient.verify.v2.services(TWILIO_SERVICE_SID)
        .verifications.create({
          to: `${country_code}${contact}`,
          channel:"whatsapp",
        });
        if(otpResponse.sid){
          return {
            success: true,
            message: 'Otp sent successfully',
          };
        }
        
  }

}
