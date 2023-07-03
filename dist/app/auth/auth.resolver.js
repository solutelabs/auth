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
exports.AuthResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const utility_1 = require("../../core/utility");
const auth_service_1 = require("./auth.service");
const dto_1 = require("./dto");
const entity_1 = require("./entity");
const model_1 = require("./model");
let AuthResolver = class AuthResolver {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(data) {
        return await this.authService.signup(data);
    }
    async login(data) {
        return this.authService.login(data);
    }
    async generateMagicLink(data) {
        return this.authService.generateMagicLink(data);
    }
    async loginViaMagicLink(token) {
        return this.authService.loginViaMagicLink(token);
    }
    async signupMobile(data) {
        return await this.authService.signupMobile(data);
    }
    async loginMobile(data) {
        return this.authService.loginMobile(data);
    }
    async updateContact(user, data) {
        return this.authService.updateContact(user, data);
    }
    async refreshToken(refreshToken) {
        return await this.authService.refreshToken(refreshToken);
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('input', { type: () => dto_1.SignupDto })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SignupDto]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "signup", null);
__decorate([
    (0, graphql_1.Mutation)(() => model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('input', { type: () => dto_1.LoginDto })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Mutation)(() => model_1.MagicLinkResponse),
    __param(0, (0, graphql_1.Args)('input', { type: () => dto_1.MagicLinkDto })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MagicLinkDto]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "generateMagicLink", null);
__decorate([
    (0, graphql_1.Mutation)(() => model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "loginViaMagicLink", null);
__decorate([
    (0, graphql_1.Mutation)(() => model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('input', { type: () => dto_1.MobileDto })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MobileDto]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "signupMobile", null);
__decorate([
    (0, graphql_1.Mutation)(() => model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('input', { type: () => dto_1.MobileDto })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MobileDto]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "loginMobile", null);
__decorate([
    (0, graphql_1.Mutation)(() => model_1.AuthResponse),
    (0, common_1.UseGuards)(utility_1.JwtAuthGuard),
    __param(0, (0, utility_1.User)()),
    __param(1, (0, graphql_1.Args)('input', { type: () => dto_1.MobileDto })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.UserEntity,
        dto_1.MobileDto]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "updateContact", null);
__decorate([
    (0, graphql_1.Mutation)(() => model_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "refreshToken", null);
AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthResolver);
exports.AuthResolver = AuthResolver;
//# sourceMappingURL=auth.resolver.js.map