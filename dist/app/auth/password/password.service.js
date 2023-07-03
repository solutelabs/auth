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
exports.PasswordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const utility_1 = require("../../../core/utility");
const utility_2 = require("../../../app/utility");
const error_1 = require("../../../core/error");
const typeorm_2 = require("@nestjs/typeorm");
const entity_1 = require("../entity");
const auth_service_1 = require("../auth.service");
const microservices_1 = require("@nestjs/microservices");
const environment_1 = require("../../../core/environment");
let PasswordService = class PasswordService {
    constructor(userRepository, authService, utilityService, client) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.utilityService = utilityService;
        this.client = client;
    }
    async changePassword(data, user) {
        const isOldPasswordCorrect = await (0, utility_1.compareHash)(data.oldPassword, user.password);
        if (!isOldPasswordCorrect) {
            throw new common_1.BadRequestException('Incorrect password', error_1.INCORRECT_PASSWORD);
        }
        await this.setNewPassword(user.id, data.newPassword);
        return {
            success: true,
            message: 'Password changed successfully',
        };
    }
    async setNewPassword(userId, password) {
        const newHashedPassword = await (0, utility_1.generateHash)(password);
        await this.userRepository.update({ id: userId }, {
            password: newHashedPassword,
        });
    }
    async forgetPassword(data) {
        const user = await this.authService.findByEmail(data.email);
        if (!user) {
            throw new common_1.NotFoundException('User not found', error_1.USER_NOT_FOUND);
        }
        const reset_password_token = await this.utilityService.generateRandomToken();
        await this.userRepository.update({ id: user.id }, {
            reset_password_token: reset_password_token,
        });
        const payload = {
            email: user.email,
            templateId: 1,
            payload: {
                name: user.firstname,
                url: `APP_END_POINT/${environment_1.RESET_PASSWORD_SLUG}/${reset_password_token}`,
            },
        };
        this.client.emit('mail:send', payload);
        return {
            success: true,
            message: 'Mail sent successfully',
        };
    }
    async resetPassword(data) {
        const user = await this.userRepository.findOne({
            reset_password_token: data.token,
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid Reset Password Token', error_1.INVALID_RESET_PASSWORD_TOKEN);
        }
        await this.setNewPassword(user.id, data.newPassword);
        await this.userRepository.update({ id: user.id }, {
            reset_password_token: null,
        });
        return {
            success: true,
            message: 'Password Changed successfully',
        };
    }
};
PasswordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(entity_1.UserEntity)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(3, (0, common_1.Inject)('MAIL_SERVICE')),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        auth_service_1.AuthService,
        utility_2.UtilityService,
        microservices_1.ClientProxy])
], PasswordService);
exports.PasswordService = PasswordService;
//# sourceMappingURL=password.service.js.map