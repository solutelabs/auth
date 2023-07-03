import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import {
  Strategy as FacebookStrategy,
  VerifyCallback as FacebookVerifyCallback,
} from 'passport-facebook';
import {
  Strategy as AppleStrategy,
  VerifyCallback as AppleVerifyCallback,
} from 'passport-apple';
//import { Strategy as TwitterStrategy,VerifyCallback as TwitterVerifyCallback } from 'passport-twitter';
// import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { AuthService } from '../auth.service';
import {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FRONTEND_URL,
  TWITTER_CALLBACK_URL,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
} from 'src/core/environment';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: 'GOOGLE_CLIENT_ID',
      clientSecret: 'GOOGLE_CLIENT_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    //console.log(profile)
    let user = await this.authService.findByEmail(emails[0].value);

    if (!user) {
      user = await this.authService.createSocialUser(
        emails[0].value,
        'google',
        name.givenName,
        name.familyName,
      );
    }
    done(null, user);
  }
}

@Injectable()
export class FacebookOAuth2Strategy extends PassportStrategy(
  FacebookStrategy,
  'facebook',
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: 'https://75be-117-248-219-84.ngrok-free.app/api/auth/facebook/callback',
      includeEmail:true,
      profileFields: ['id', 'displayName', 'photos', 'emails'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    
    // let user = await this.authService.findByEmail(emails[0].value);

    // if (!user) {
    //   user = await this.authService.createSocialUser(
    //     emails[0].value,
    //     'facebook',
    //     name.givenName,
    //     name.familyName,
    //   );
    // }
    const user =profile._json
    done(null, user);
  }
}

@Injectable()
export class AppleOAuth2Strategy extends PassportStrategy(
  AppleStrategy,
  'apple',
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: 'APPLE_CLIENT_ID',
      teamID: 'APPLE_TEAM_ID',
      keyID: 'APPLE_KEY_ID',
      privateKey: 'PRIVATE_KEY_CONTENTS',
      callbackURL: 'http://localhost:3000/api/auth/apple/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    //console.log(profile)
    let user = await this.authService.findByEmail(emails[0].value);

    if (!user) {
      user = await this.authService.createSocialUser(
        emails[0].value,
        'apple',
        name.givenName,
        name.familyName,
      );
    }
    done(null, user);
  }
}

@Injectable()
export class TwitterOAuth2Strategy extends PassportStrategy(
  TwitterStrategy,
  'twitter',
) {
  constructor(private readonly authService: AuthService) {
    super({
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: TWITTER_CALLBACK_URL,
      includeEmail: true,
      passReqToCallback: true,
      origin: FRONTEND_URL,
    });
  }
  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
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
}
