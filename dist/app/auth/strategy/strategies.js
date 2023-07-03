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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterOAuth2Strategy = exports.AppleOAuth2Strategy = exports.FacebookOAuth2Strategy = exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_apple_1 = require("passport-apple");
const passport_twitter_1 = require("passport-twitter");
const auth_service_1 = require("../auth.service");
const environment_1 = require("../../../core/environment");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(authService) {
        super({
            clientID: 'GOOGLE_CLIENT_ID',
            clientSecret: 'GOOGLE_CLIENT_SECRET',
            callbackURL: 'http://localhost:3000/api/auth/google/callback',
            scope: ['email', 'profile'],
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { name, emails } = profile;
        let user = await this.authService.findByEmail(emails[0].value);
        if (!user) {
            user = await this.authService.createSocialUser(emails[0].value, 'google', name.givenName, name.familyName);
        }
        done(null, user);
    }
};
GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], GoogleStrategy);
exports.GoogleStrategy = GoogleStrategy;
let FacebookOAuth2Strategy = class FacebookOAuth2Strategy extends (0, passport_1.PassportStrategy)(passport_facebook_1.Strategy, 'facebook') {
    constructor(authService) {
        super({
            clientID: environment_1.FACEBOOK_APP_ID,
            clientSecret: environment_1.FACEBOOK_APP_SECRET,
            callbackURL: 'https://75be-117-248-219-84.ngrok-free.app/api/auth/facebook/callback',
            includeEmail: true,
            profileFields: ['id', 'displayName', 'photos', 'emails'],
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const user = profile._json;
        done(null, user);
    }
};
FacebookOAuth2Strategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], FacebookOAuth2Strategy);
exports.FacebookOAuth2Strategy = FacebookOAuth2Strategy;
let AppleOAuth2Strategy = class AppleOAuth2Strategy extends (0, passport_1.PassportStrategy)(passport_apple_1.Strategy, 'apple') {
    constructor(authService) {
        super({
            clientID: 'APPLE_CLIENT_ID',
            teamID: 'APPLE_TEAM_ID',
            keyID: 'APPLE_KEY_ID',
            privateKey: 'PRIVATE_KEY_CONTENTS',
            callbackURL: 'http://localhost:3000/api/auth/apple/callback',
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { name, emails } = profile;
        let user = await this.authService.findByEmail(emails[0].value);
        if (!user) {
            user = await this.authService.createSocialUser(emails[0].value, 'apple', name.givenName, name.familyName);
        }
        done(null, user);
    }
};
AppleOAuth2Strategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AppleOAuth2Strategy);
exports.AppleOAuth2Strategy = AppleOAuth2Strategy;
let TwitterOAuth2Strategy = class TwitterOAuth2Strategy extends (0, passport_1.PassportStrategy)(passport_twitter_1.Strategy, 'twitter') {
    constructor(authService) {
        super({
            consumerKey: environment_1.TWITTER_CONSUMER_KEY,
            consumerSecret: environment_1.TWITTER_CONSUMER_SECRET,
            callbackURL: environment_1.TWITTER_CALLBACK_URL,
            includeEmail: true,
            passReqToCallback: true,
            origin: environment_1.FRONTEND_URL,
        });
        this.authService = authService;
    }
    async validate(request, accessToken, refreshToken, profile, done) {
        const twitterProfile = profile._json;
        const { name, email, id_str, screen_name } = twitterProfile;
        const user = {
            name,
            email,
            id_str,
            screen_name,
        };
        done(null, user);
    }
};
TwitterOAuth2Strategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], TwitterOAuth2Strategy);
exports.TwitterOAuth2Strategy = TwitterOAuth2Strategy;
//# sourceMappingURL=strategies.js.map