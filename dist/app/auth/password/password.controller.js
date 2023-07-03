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
exports.PasswordController = void 0;
const common_1 = require("@nestjs/common");
const utility_1 = require("../../../core/utility");
const entity_1 = require("../entity");
const dto_1 = require("./dto");
const password_service_1 = require("./password.service");
let PasswordController = class PasswordController {
    constructor(passwordService) {
        this.passwordService = passwordService;
    }
    async changePassword(data, user) {
        return this.passwordService.changePassword(data, user);
    }
    async forgetPassword(data) {
        return this.passwordService.forgetPassword(data);
    }
    async resetPassword(data) {
        return this.passwordService.resetPassword(data);
    }
};
__decorate([
    (0, common_1.Post)('/changePassword'),
    (0, common_1.UseGuards)(utility_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utility_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ChangePasswordDto,
        entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('/forgotPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ForgetPasswordDto]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.Post)('/resetPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "resetPassword", null);
PasswordController = __decorate([
    (0, common_1.Controller)('password'),
    __metadata("design:paramtypes", [password_service_1.PasswordService])
], PasswordController);
exports.PasswordController = PasswordController;
//# sourceMappingURL=password.controller.js.map