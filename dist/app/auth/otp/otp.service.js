"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const otplib_1 = require("otplib");
const typeorm_2 = require("typeorm");
const randomString = __importStar(require("randomstring"));
const entity_1 = require("./entity");
const error_1 = require("../../../core/error");
const country_service_1 = require("../../country/country.service");
const microservices_1 = require("@nestjs/microservices");
const constant_1 = require("../../../core/constant");
const auth_service_1 = require("../auth.service");
const twilio_1 = require("twilio");
const environment_1 = require("../../../core/environment");
otplib_1.totp.options = { digits: 6, window: 1, step: 60 };
let OtpService = class OtpService {
    constructor(otpRepository, countryService, authService, client) {
        this.otpRepository = otpRepository;
        this.countryService = countryService;
        this.authService = authService;
        this.client = client;
        this.twilioClient = new twilio_1.Twilio(environment_1.TWILIO_ACCOUNT_SID, environment_1.TWILIO_AUTH_TOKEN);
    }
    async createAndSendOtp(data) {
        const { contact, country_code, mode } = data;
        if (mode === constant_1.OTP_OPTIONS.SIGNUP || mode === constant_1.OTP_OPTIONS.UPDATE) {
            await this.authService.validateUserContact(contact);
        }
        else if (mode === constant_1.OTP_OPTIONS.LOGIN || mode === constant_1.OTP_OPTIONS.VERIFY) {
            const user = await this.authService.findByContact(contact);
            if (!user) {
                throw new common_1.NotFoundException('User not found', error_1.USER_NOT_FOUND);
            }
            if (!user.is_active) {
                throw new common_1.UnauthorizedException('You are not authorized to access', error_1.UNAUTHORIZED);
            }
        }
        const country = await this.countryService.findById(country_code);
        if (!country) {
            throw new common_1.NotFoundException('Invalid Country code', error_1.INVALID_COUNTRY_CODE);
        }
        const otpSecret = await randomString.generate(32);
        const payload = {
            otp_secret: otpSecret,
            contact: country_code + contact,
        };
        const otpCode = await this.generate(otpSecret);
        await this.sendOtpSMS(payload.contact, otpCode, mode);
        await this.otpRepository.save(payload);
        return {
            success: true,
            message: `Otp sent successfully. Your otp is ${otpCode}`,
        };
    }
    async generate(secret) {
        return otplib_1.totp.generate(secret);
    }
    async validate(token, secret) {
        return otplib_1.totp.check(token, secret);
    }
    async verifyOtp(data) {
        const { contact, otp, country_code } = data;
        const country = await this.countryService.findById(country_code);
        if (!country) {
            throw new common_1.NotFoundException('Invalid Country code', error_1.INVALID_COUNTRY_CODE);
        }
        const otpData = await this.otpRepository.find({
            where: { contact: country_code + contact, otp_verified_at: null },
            order: { created_at: 'DESC' },
            take: 1,
        });
        if (!otpData.length) {
            throw new common_1.NotFoundException('Invalid OTP', error_1.INVALID_OTP);
        }
        const isValidOtp = await this.validate(otp, otpData[0].otp_secret);
        if (!isValidOtp) {
            throw new common_1.BadRequestException('Invalid otp', error_1.INVALID_OTP);
        }
        const verified_at = new Date().toISOString();
        await this.otpRepository.update({ id: otpData[0].id }, { otp_verified_at: verified_at });
        return {
            success: true,
            message: 'Otp verified successfully',
        };
    }
    async sendOtpSMS(mobile_number, otp, mode) {
        let message = `Hi, use this OTP ${otp} to login to your xxxx account.`;
        if (mode === constant_1.OTP_OPTIONS.SIGNUP)
            message = `Your xxxx OTP is ${otp}. Please enter this code in the app to complete your registration.`;
        if (mode === constant_1.OTP_OPTIONS.VERIFY)
            message = `Your xxxx OTP is ${otp}. Please enter this code in the app to verify your number.`;
        if (mode === constant_1.OTP_OPTIONS.UPDATE)
            message = `Your xxxx OTP is ${otp}. Please enter this code in the app to update your number.`;
        this.client.emit('message:send', {
            to: mobile_number,
            message: message,
        });
    }
    async createAndSendWhatsAppOtp(data) {
        const { mode, country_code, contact } = data;
        if (mode === constant_1.OTP_OPTIONS.SIGNUP || mode === constant_1.OTP_OPTIONS.UPDATE) {
            await this.authService.validateUserContact(contact);
        }
        else if (mode === constant_1.OTP_OPTIONS.LOGIN || mode === constant_1.OTP_OPTIONS.VERIFY) {
            const user = await this.authService.findByContact(contact);
            if (!user) {
                throw new common_1.NotFoundException('User not found', error_1.USER_NOT_FOUND);
            }
            if (!user.is_active) {
                throw new common_1.UnauthorizedException('You are not authorized to access', error_1.UNAUTHORIZED);
            }
            if (user.provider !== constant_1.PROVIDERS.WHATSAPP) {
                throw new common_1.UnauthorizedException('User registered with different provider');
            }
        }
        const country = await this.countryService.findById(country_code);
        if (!country) {
            throw new common_1.NotFoundException('Invalid Country code', error_1.INVALID_COUNTRY_CODE);
        }
        const otpResponse = await this.twilioClient.verify.v2.services(environment_1.TWILIO_SERVICE_SID)
            .verifications.create({
            to: `${country_code}${contact}`,
            channel: "whatsapp",
        });
        if (otpResponse.sid) {
            return {
                success: true,
                message: 'Otp sent successfully',
            };
        }
    }
};
OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.OtpEntity)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(3, (0, common_1.Inject)('MESSAGE_SERVICE')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        country_service_1.CountryService,
        auth_service_1.AuthService,
        microservices_1.ClientProxy])
], OtpService);
exports.OtpService = OtpService;
//# sourceMappingURL=otp.service.js.map