"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../../core/constant");
const utility_1 = require("../../../core/utility");
const entity_1 = require("../entity");
const dto_1 = require("./dto");
const otp_service_1 = require("./otp.service");
let OtpController = class OtpController {
    constructor(otpService) {
        this.otpService = otpService;
    }
    async sendOtp(data) {
        try {
            return await this.otpService.createAndSendOtp(data);
        }
        catch (error) {
            return error;
        }
    }
    async whatsappSendOtp(data) {
        try {
            return await this.otpService.createAndSendWhatsAppOtp(data);
        }
        catch (error) {
            return error;
        }
    }
    async generateVerifyOtp(user) {
        const data = {
            contact: user.contact,
            mode: constant_1.OTP_OPTIONS.VERIFY,
            country_code: user.country_code,
        };
        return this.otpService.createAndSendOtp(data);
    }
    async verifyOtp(user, otp) {
        const data = {
            contact: user.contact,
            otp: otp,
            country_code: user.country_code,
        };
        return this.otpService.verifyOtp(data);
    }
    async generateUpdateOtp(dtoData) {
        const data = {
            contact: dtoData.contact,
            mode: constant_1.OTP_OPTIONS.UPDATE,
            country_code: dtoData.country_code,
        };
        return this.otpService.createAndSendOtp(data);
    }
};
__decorate([
    (0, common_1.Post)('sendOtp'),
    (0, swagger_1.ApiBody)({ type: dto_1.SendOtpDto }),
    (0, common_1.UseGuards)(utility_1.RestThrottlerGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SendOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('whatsappSendOtp'),
    (0, swagger_1.ApiBody)({ type: dto_1.SendOtpDto }),
    (0, swagger_1.ApiAcceptedResponse)({ description: 'Otp sent successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid Request' }),
    (0, common_1.UseGuards)(utility_1.RestThrottlerGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SendOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "whatsappSendOtp", null);
__decorate([
    (0, common_1.Post)('generateVerifyOtp'),
    (0, common_1.UseGuards)(utility_1.RestThrottlerGuard),
    (0, common_1.UseGuards)(utility_1.JwtAuthGuard),
    __param(0, (0, utility_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "generateVerifyOtp", null);
__decorate([
    (0, common_1.Post)('verifyOtp'),
    (0, common_1.UseGuards)(utility_1.JwtAuthGuard),
    __param(0, (0, utility_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('generateUpdateOtp'),
    (0, common_1.UseGuards)(utility_1.RestThrottlerGuard),
    (0, common_1.UseGuards)(utility_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SendOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "generateUpdateOtp", null);
OtpController = __decorate([
    (0, common_1.Controller)('otp'),
    __metadata("design:paramtypes", [otp_service_1.OtpService])
], OtpController);
exports.OtpController = OtpController;
//# sourceMappingURL=otp.controller.js.map