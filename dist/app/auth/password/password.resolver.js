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
exports.PasswordResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const model_1 = require("./model");
const dto_1 = require("./dto");
const password_service_1 = require("./password.service");
const common_1 = require("@nestjs/common");
const utility_1 = require("../../../core/utility");
const entity_1 = require("../entity");
let PasswordResolver = class PasswordResolver {
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
    (0, graphql_1.Mutation)(() => model_1.ChangePassword),
    (0, common_1.UseGuards)(utility_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input', { type: () => dto_1.ChangePasswordDto })),
    __param(1, (0, utility_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ChangePasswordDto,
        entity_1.LoginEntity]),
    __metadata("design:returntype", Promise)
], PasswordResolver.prototype, "changePassword", null);
__decorate([
    (0, graphql_1.Mutation)(() => model_1.ForgetPasswordModel),
    __param(0, (0, graphql_1.Args)('input', { type: () => dto_1.ForgetPasswordDto })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ForgetPasswordDto]),
    __metadata("design:returntype", Promise)
], PasswordResolver.prototype, "forgetPassword", null);
__decorate([
    (0, graphql_1.Mutation)(() => model_1.ResetPasswordResponse),
    __param(0, (0, graphql_1.Args)('input', { type: () => dto_1.ResetPasswordDto })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], PasswordResolver.prototype, "resetPassword", null);
PasswordResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [password_service_1.PasswordService])
], PasswordResolver);
exports.PasswordResolver = PasswordResolver;
//# sourceMappingURL=password.resolver.js.map