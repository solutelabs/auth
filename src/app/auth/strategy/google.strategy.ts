import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  GOOGLE_CALLBACK_URL,
} from '../../../core/environment';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
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
    // console.log('user is :',user)
    if(user.id)
    done(null, user);
  }
}
