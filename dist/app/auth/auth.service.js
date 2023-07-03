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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const utility_1 = require("./../../core/utility");
const googleapis_1 = require("googleapis");
const error_1 = require("../../core/error");
const constant_1 = require("../../core/constant");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entity_1 = require("./entity");
const microservices_1 = require("@nestjs/microservices");
const crypto = __importStar(require("crypto"));
const environment_1 = require("../../core/environment");
const otp_service_1 = require("./otp/otp.service");
const twilio_1 = require("twilio");
const country_service_1 = require("../country/country.service");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, otpService, countryService, client, assetClient) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.countryService = countryService;
        this.client = client;
        this.assetClient = assetClient;
        this.oauthClient = new googleapis_1.google.auth.OAuth2(environment_1.GOOGLE_CLIENT_ID, environment_1.GOOGLE_SECRET);
        this.TwilioClient = new twilio_1.Twilio(environment_1.TWILIO_ACCOUNT_SID, environment_1.TWILIO_AUTH_TOKEN);
    }
    async signup(data) {
        const { email, password, username } = data;
        const user = await this.validateUserEmail(email);
        console.log(user, 'user');
        if (user) {
            throw new common_1.BadRequestException('User already exists', error_1.USER_ALREADY_EXISTS);
        }
        const hashedPassword = await (0, utility_1.generateHash)(password);
        const createUser = this.userRepository.create({
            email: email,
            password: hashedPassword,
            username: username,
            role: constant_1.ROLES.USER,
        });
        const saveUser = await this.userRepository.save(createUser);
        if (!saveUser) {
            throw new common_1.InternalServerErrorException(error_1.INTERNAL_SERVER_ERROR);
        }
        const payload = {
            id: saveUser.id,
            role: saveUser.role,
            is_active: saveUser.is_active,
        };
        this.assetClient.emit('user:create', payload);
        return this.getAuthResponse(saveUser.id, saveUser.role);
    }
    async login(data) {
        const user = await this.findByEmail(data.email);
        if (!user) {
            throw new common_1.UnauthorizedException(error_1.INVALID_CREDENTIALS);
        }
        const isPasswordValid = await (0, utility_1.compareHash)(data.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException(error_1.INVALID_CREDENTIALS);
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException(error_1.UNAUTHORIZED);
        }
        return this.getAuthResponse(user.id, user.role);
    }
    async GoogleAuthSignUp(data) {
        try {
            const tokenInfo = await this.oauthClient.getTokenInfo(data.accessToken);
            const { email, sub } = tokenInfo;
            if (!data.accessToken && !email) {
                throw new common_1.NotFoundException('Whoops, something went wrong. Please try again.', error_1.INVALID_TOKEN);
            }
            let user = await (0, typeorm_2.getRepository)(entity_1.UserEntity).findOne({
                where: {
                    email: email,
                    google_id: sub,
                },
            });
            const signUpEmail = await (0, typeorm_2.getRepository)(entity_1.UserEntity).findOne({
                where: {
                    email: email,
                },
            });
            if (!user && signUpEmail) {
                throw new common_1.ConflictException('Whoops! This email address is already registered. Please try again.');
            }
            if (!user) {
                const newUser = this.userRepository.create({
                    email: email,
                    google_id: sub,
                    role: constant_1.ROLES.USER,
                    provider: constant_1.PROVIDERS.GOOGLE,
                });
                user = await (0, typeorm_2.getRepository)(entity_1.UserEntity).save(newUser);
                return this.getAuthResponse(user.id, user.role);
            }
            return this.getAuthResponse(user.id, user.role);
        }
        catch (err) {
            common_1.Logger.log('error', err);
            throw err;
        }
    }
    async GoogleAuthSigIn(data) {
        try {
            const tokenInfo = await this.oauthClient.getTokenInfo(data.accessToken);
            const { email, sub } = tokenInfo;
            if (!data.accessToken && !email) {
                throw new common_1.NotFoundException('Whoops, something went wrong. Please try again.', error_1.INVALID_TOKEN);
            }
            const user = await (0, typeorm_2.getRepository)(entity_1.UserEntity).findOne({
                where: {
                    email: email,
                    google_id: sub,
                },
            });
            if (!user) {
                throw new common_1.NotFoundException('Whoops, please create your account to login.', error_1.USER_NOT_FOUND);
            }
            return this.getAuthResponse(user.id, user.role);
        }
        catch (err) {
            common_1.Logger.log('error', err);
            throw err;
        }
    }
    async LinkGoogleAccount(data, user) {
        try {
            const id = data.id;
            if (id !== user.id) {
                throw new common_1.BadRequestException('You are not authorized to make changes for different user');
            }
            const tokenInfo = await this.oauthClient.getTokenInfo(data.accessToken);
            const { sub } = tokenInfo;
            if (user.provider === constant_1.PROVIDERS.GOOGLE && user.google_id !== sub) {
                throw new common_1.BadRequestException('You have created this account using google signup so you cannot change the google id');
            }
            const googleUser = await this.userRepository.findOne({
                where: {
                    google_id: sub,
                },
            });
            if (googleUser.id !== user.id) {
                throw new common_1.BadRequestException('this google account is already linked to different account');
            }
            user.google_id = sub;
            await this.userRepository.save(user);
            return 'successfully linked google account';
        }
        catch (error) {
            common_1.Logger.log('error', error);
            throw error;
        }
    }
    async twitterUser(data) {
        const { email, id_str, name, screen_name } = data;
        let user;
        if (email) {
            user = await this.validateUserEmail(email);
            if (user) {
                if (user.provider !== constant_1.PROVIDERS.TWITTER)
                    throw new common_1.ConflictException('Email is not registered using twitter with the app, try using twitter account having different email id');
                return await this.getAuthResponse(user.id, user.role);
            }
            else {
                user = this.userRepository.create({
                    email,
                    twitter_id: id_str,
                    firstname: name,
                    provider: constant_1.PROVIDERS.TWITTER,
                });
                user = await this.userRepository.save(user);
                return await this.getAuthResponse(user.id, user.role);
            }
        }
        else {
            throw new common_1.BadRequestException('Your twitter account does not contain required info such as email');
        }
    }
    async LinkTwitterAccount(twitterUser, user) {
        try {
            const { id_str } = twitterUser;
            if (user.provider === constant_1.PROVIDERS.TWITTER && user.twitter_id !== id_str) {
                throw new common_1.BadRequestException('You have created this account using twitter signup so you cannot change the twitter id');
            }
            const registeredTwitterUser = await this.userRepository.findOne({
                where: {
                    twitter_id: id_str,
                },
            });
            if (registeredTwitterUser.id !== user.id) {
                throw new common_1.BadRequestException('this twitter account is already linked to different account');
            }
            user.twitter_id = id_str;
            await this.userRepository.save(user);
            return 'successfully linked twitter account';
        }
        catch (error) {
            common_1.Logger.log('error', error);
            throw error;
        }
    }
    async facebookUser(data) {
        const { email, id, name } = data;
        let user;
        if (email) {
            user = await this.validateUserEmail(email);
            if (user) {
                if (user.provider !== constant_1.PROVIDERS.FACEBOOK)
                    throw new common_1.ConflictException('Email is not registered using facebook with the app, try using facebook account having different email id');
                return await this.getAuthResponse(user.id, user.role);
            }
            else {
                user = this.userRepository.create({
                    email,
                    facebook_id: id,
                    firstname: name,
                    provider: constant_1.PROVIDERS.FACEBOOK,
                });
                user = await this.userRepository.save(user);
                return await this.getAuthResponse(user.id, user.role);
            }
        }
        else {
            throw new common_1.BadRequestException('Your facebook account does not contain required info such as email');
        }
    }
    async LinkFacebookAccount(facebookUser, user) {
        try {
            const { id } = facebookUser;
            if (user.provider === constant_1.PROVIDERS.FACEBOOK && user.twitter_id !== id) {
                throw new common_1.BadRequestException('You have created this account using twitter signup so you cannot change the twitter id');
            }
            const registeredTwitterUser = await this.userRepository.findOne({
                where: {
                    facebook_id: id,
                },
            });
            if (registeredTwitterUser.id !== user.id) {
                throw new common_1.BadRequestException('this facebook account is already linked to different account');
            }
            user.facebook_id = id;
            await this.userRepository.save(user);
            return 'successfully linked twitter account';
        }
        catch (error) {
            common_1.Logger.log('error', error);
            throw error;
        }
    }
    async generateMagicLink(data) {
        const user = await this.findByEmail(data.email);
        if (!user) {
            throw new common_1.NotFoundException('User does not exists', error_1.USER_NOT_FOUND);
        }
        const token = await this.generateRandomToken();
        await this.userRepository.update({ id: user.id }, { magic_link: token });
        const payload = {
            email: user.email,
            name: user.firstname,
            url: `APP_END_POINT/token/${token}`,
        };
        this.client.emit('mail:generate-magiclink', payload);
        return {
            success: true,
            message: 'Mail sent successfully',
        };
    }
    async loginViaMagicLink(token) {
        const user = await this.userRepository.findOne({
            magic_link: token,
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid Token', error_1.INVALID_TOKEN);
        }
        if (!user || !user.is_active) {
            throw new common_1.UnauthorizedException();
        }
        await this.userRepository.update({ id: user.id }, { magic_link: null });
        return this.getAuthResponse(user.id, user.role);
    }
    async validateUserEmail(email) {
        const user = await this.findByEmail(email);
        return user;
    }
    async validateUserContact(contact) {
        const user = await this.findByContact(contact);
        if (user) {
            throw new common_1.BadRequestException('User already exists', error_1.USER_ALREADY_EXISTS);
        }
    }
    async findByEmail(email) {
        try {
            return await this.userRepository.findOne({
                where: { email: email },
            });
        }
        catch (error) {
            return error;
        }
    }
    async findById(id) {
        return this.userRepository.findOne({
            where: { id: id },
        });
    }
    async findByEmailAndProvider(email, provider) {
        return this.userRepository.findOne({
            where: { email: email, provider: provider },
        });
    }
    async createSocialUser(email, provider, firstname, lastname) {
        console.log('creating social user');
        const createUser = this.userRepository.create({
            email: email,
            role: constant_1.ROLES.USER,
            provider: provider,
            firstname: firstname,
            lastname: lastname,
        });
        const saveUser = await this.userRepository.save(createUser);
        if (!saveUser) {
            throw new common_1.InternalServerErrorException(error_1.INTERNAL_SERVER_ERROR);
        }
        return saveUser;
    }
    async generateRandomToken() {
        try {
            const token = crypto.randomBytes(16).toString('hex');
            return this.isTokenPresentInAnotherUser(token);
        }
        catch (error) {
            common_1.Logger.error(error);
        }
    }
    async isTokenPresentInAnotherUser(token) {
        const result = await (0, typeorm_2.getRepository)(entity_1.UserEntity).findOne({
            magic_link: token,
        });
        return result ? this.generateRandomToken() : token;
    }
    async getAuthResponse(userId, role) {
        const payload = {
            user_id: userId,
            role: role,
        };
        return {
            accessToken: this.jwtService.sign(payload, { secret: environment_1.JWT_SECRET }),
            refreshToken: this.jwtService.sign({ user_id: userId }, { expiresIn: `${environment_1.REFRESH_JWT_EXPIRES_IN_DAYS}d`, secret: environment_1.JWT_SECRET }),
            data: Object.assign({}, payload),
        };
    }
    async findByContact(contact) {
        return this.userRepository.findOne({
            where: { contact: contact },
        });
    }
    async updateContact(user, data) {
        const userDetails = await this.findByContact(data.contact);
        if (userDetails) {
            throw new common_1.BadRequestException('User already exists with this mobile number', error_1.USER_ALREADY_EXISTS_WITH_THIS_MOBILE_NUMBER);
        }
        await this.otpService.verifyOtp(data);
        await this.userRepository.update({
            id: user.id,
        }, { contact: data.contact });
        return this.getAuthResponse(user.id, user.role);
    }
    async refreshToken(refreshToken) {
        const tokenData = this.jwtService.verify(refreshToken);
        const user = await this.findById(tokenData.user_id);
        if (!user) {
            throw new common_1.NotFoundException('User not found', error_1.USER_NOT_FOUND);
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException(error_1.UNAUTHORIZED);
        }
        return this.getAuthResponse(user.id, user.role);
    }
    async signupMobile(data) {
        const { country_code, contact } = data;
        await this.validateUserContact(contact);
        await this.otpService.verifyOtp(data);
        const saveUser = await this.userRepository.save({
            contact: contact,
            country_code: country_code,
        });
        if (!saveUser) {
            throw new common_1.InternalServerErrorException(error_1.INTERNAL_SERVER_ERROR);
        }
        return this.getAuthResponse(saveUser.id, saveUser.role);
    }
    async loginMobile(data) {
        const user = await this.findByContact(data.contact);
        if (!user) {
            throw new common_1.NotFoundException('User not found', error_1.USER_NOT_FOUND);
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException(error_1.UNAUTHORIZED);
        }
        await this.otpService.verifyOtp(data);
        return this.getAuthResponse(user.id, user.role);
    }
    async appleLogin(data) {
        if (!data.user) {
            throw new common_1.UnauthorizedException(error_1.INVALID_CREDENTIALS);
        }
        const { user } = data.user;
        return this.getAuthResponse(user.id, user.role);
    }
    async whatsappSignup(data) {
        const { country_code, otp, contact } = data;
        const country = await this.countryService.findById(country_code);
        if (!country) {
            throw new common_1.NotFoundException('Invalid Country code', error_1.INVALID_COUNTRY_CODE);
        }
        await this.validateUserContact(contact);
        const verifiedResponse = await this.TwilioClient.verify.v2
            .services(environment_1.TWILIO_SERVICE_SID)
            .verificationChecks.create({
            to: `${country_code}${contact}`,
            code: otp,
        });
        if (verifiedResponse) {
            if (verifiedResponse.valid == false ||
                verifiedResponse.status !== 'approved') {
                throw new common_1.UnauthorizedException('Invalid OTP');
            }
            const saveUser = await this.userRepository.save({
                contact: contact,
                country_code: country_code,
                provider: constant_1.PROVIDERS.WHATSAPP,
            });
            if (!saveUser) {
                throw new common_1.InternalServerErrorException(error_1.INTERNAL_SERVER_ERROR);
            }
            return this.getAuthResponse(saveUser.id, saveUser.role);
        }
    }
    async loginWhatsApp(data) {
        const { country_code, otp, contact } = data;
        const country = await this.countryService.findById(country_code);
        if (!country) {
            throw new common_1.NotFoundException('Invalid Country code', error_1.INVALID_COUNTRY_CODE);
        }
        const user = await this.findByContact(data.contact);
        if (!user) {
            throw new common_1.NotFoundException('User not found', error_1.USER_NOT_FOUND);
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException(error_1.UNAUTHORIZED);
        }
        if (user.provider !== constant_1.PROVIDERS.WHATSAPP) {
            throw new common_1.UnauthorizedException('User is registered with different provider');
        }
        const verifiedResponse = await this.TwilioClient.verify.v2
            .services(environment_1.TWILIO_SERVICE_SID)
            .verificationChecks.create({
            to: `${country_code}${contact}`,
            code: otp,
        });
        if (verifiedResponse) {
            if (verifiedResponse.valid == false ||
                verifiedResponse.status !== 'approved') {
                throw new common_1.UnauthorizedException('Invalid OTP');
            }
            return await this.getAuthResponse(user.id, user.role);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.UserEntity)),
    __param(4, (0, common_1.Inject)('MAIL_SERVICE')),
    __param(5, (0, common_1.Inject)('ASSET_SERVICE')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        otp_service_1.OtpService,
        country_service_1.CountryService,
        microservices_1.ClientProxy,
        microservices_1.ClientProxy])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map