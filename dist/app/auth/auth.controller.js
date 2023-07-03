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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const utility_1 = require("../../core/utility");
const auth_service_1 = require("./auth.service");
const dto_1 = require("./dto");
const entity_1 = require("./entity");
const swagger_1 = require("@nestjs/swagger");
const error_1 = require("../../core/error");
const environment_1 = require("../../core/environment");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async test() {
        return 'testing';
    }
    async appleAuth(req) {
        return common_1.HttpStatus.OK;
    }
    async appleAuthRedirect(payload) {
        if (payload.id_token)
            return this.authService.appleLogin(payload);
        else
            throw new common_1.UnauthorizedException('Unauthorized Token Recieved from Apple');
    }
    async GoogleAuthSignUp(data) {
        return await this.authService.GoogleAuthSignUp(data);
    }
    async GoogleAuthSignIn(data) {
        return await this.authService.GoogleAuthSigIn(data);
    }
    async LinkGoogleAccount(data, user) {
        return await this.authService.LinkGoogleAccount(data, user);
    }
    async twitter() { }
    async twitterRedirect(req, res) {
        if (req.session &&
            req.session.originalUrl &&
            req.session.originalUrl === '/api/auth/link/twitter') {
            const message = await this.authService.LinkTwitterAccount(req.user, req.session.user);
            ;
            const redirectUrl = `${environment_1.FRONTEND_URL}?response=${message}`;
            delete req.session.originalUrl;
            delete req.session.user;
            res.redirect(redirectUrl);
        }
        else {
            let authResponse = JSON.stringify(await this.authService.twitterUser({
                email: req.user.email,
                id_str: req.user.id_str,
                name: req.user.name,
                screen_name: req.user.screen_name,
            }));
            const redirectUrl = `${environment_1.FRONTEND_URL}?response=${authResponse}`;
            res.redirect(redirectUrl);
            ;
        }
    }
    async LinkTwitterAccount(req, res, data) {
        if (data.id !== req.user.id) {
            throw new common_1.BadRequestException(error_1.UNAUTHORIZED);
        }
        const redirectUrl = `/api/auth/twitter?originalUrl=${req.originalUrl}`;
        req.session.user = req.user;
        req.session.originalUrl = req.originalUrl;
        res.redirect(redirectUrl);
    }
    async profile(userAuth, res) {
        userAuth = userAuth.userAuth;
        const user = JSON.parse(userAuth);
        return user;
    }
    async facebook() { }
    async facebookRedirect(req, res) {
        if (req.session &&
            req.session.originalUrl &&
            req.session.originalUrl === '/api/auth/link/facebook') {
            const message = await this.authService.LinkFacebookAccount(req.user, req.session.user);
            const redirectUrl = `${environment_1.FRONTEND_URL}?response=${message}`;
            delete req.session.originalUrl;
            delete req.session.user;
            return redirectUrl;
        }
        else {
            console.log(req.user);
            let authResponse = JSON.stringify(await this.authService.facebookUser({
                email: req.user.email,
                id: req.user.id,
                name: req.user.name,
            }));
            console.log(authResponse);
            const redirectUrl = `${environment_1.FRONTEND_URL}?response=${authResponse}`;
            res.redirect(redirectUrl);
            ;
        }
    }
    async LinkFacebookAccount(req, res, data) {
        if (data.id !== req.user.id) {
            throw new common_1.BadRequestException(error_1.UNAUTHORIZED);
        }
        const redirectUrl = `/api/auth/facebook?originalUrl=${req.originalUrl}`;
        req.session.user = req.user;
        req.session.originalUrl = req.originalUrl;
        res.redirect(redirectUrl);
    }
    async signup(data) {
        try {
            return await this.authService.signup(data);
        }
        catch (error) {
            return error;
        }
    }
    async login(data) {
        return await this.authService.login(data);
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
    async signupWhatsApp(data) {
        return await this.authService.whatsappSignup(data);
    }
    async loginWhatsapp(data) {
        return await this.authService.loginWhatsApp(data);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "test", null);
__decorate([
    (0, common_1.Get)('apple'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('apple')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "appleAuth", null);
__decorate([
    (0, common_1.Post)('apple/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('apple')),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "appleAuthRedirect", null);
__decorate([
    (0, common_1.Post)('google/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GoogleAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "GoogleAuthSignUp", null);
__decorate([
    (0, common_1.Post)('/google/signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GoogleAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "GoogleAuthSignIn", null);
__decorate([
    (0, common_1.Post)('link/google'),
    (0, common_1.UseGuards)(utility_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utility_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "LinkGoogleAccount", null);
__decorate([
    (0, common_1.Get)('twitter'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('twitter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "twitter", null);
__decorate([
    (0, common_1.Get)('twitter/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('twitter')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "twitterRedirect", null);
__decorate([
    (0, common_1.Post)('link/twitter'),
    (0, common_1.UseGuards)(utility_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "LinkTwitterAccount", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "profile", null);
__decorate([
    (0, common_1.Get)('facebook'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebook", null);
__decorate([
    (0, common_1.Get)('facebook/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookRedirect", null);
__decorate([
    (0, common_1.Post)('link/facebook'),
    (0, common_1.UseGuards)(utility_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "LinkFacebookAccount", null);
__decorate([
    (0, common_1.Post)('signup'),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'User registered using email/username and password',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.SignupDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SignupDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOkResponse)({ description: 'User logged in' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid Credentials' }),
    (0, swagger_1.ApiBody)({ type: dto_1.LoginDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('generateMagicLink'),
    (0, swagger_1.ApiBody)({ type: dto_1.MagicLinkDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MagicLinkDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateMagicLink", null);
__decorate([
    (0, common_1.Post)('loginViaMagicLink'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginViaMagicLink", null);
__decorate([
    (0, common_1.Post)('signupMobile'),
    (0, swagger_1.ApiBody)({ type: dto_1.MobileDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Signup Successfully done' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid Inputs' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MobileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupMobile", null);
__decorate([
    (0, common_1.Post)('loginMobile'),
    (0, swagger_1.ApiBody)({ type: dto_1.MobileDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid Inputs' }),
    (0, swagger_1.ApiAcceptedResponse)({ description: 'User Log in Success' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MobileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginMobile", null);
__decorate([
    (0, common_1.Post)('updateContact'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(utility_1.JwtAuthGuard),
    __param(0, (0, utility_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.UserEntity, dto_1.MobileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Post)('refreshToken'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('signupWhatsApp'),
    (0, swagger_1.ApiBody)({ type: dto_1.MobileDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'User signed up via Whatsapp' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Signing Up Failed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MobileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupWhatsApp", null);
__decorate([
    (0, common_1.Post)('loginWhatsApp'),
    (0, swagger_1.ApiBody)({ type: dto_1.MobileDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'User logged in via Whatsapp' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Signing in Failed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MobileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWhatsapp", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map