import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
//import { Strategy } from "passport-google-oauth20";
import { Strategy, VerifyCallback } from "passport-apple";
import { APPLE_CALLBACK, APPLE_CLIENT_ID, APPLE_KEYFILE_PATH, APPLE_KEYID, APPLE_TEAMID } from "src/core/environment";
import { AuthService } from "../auth.service";


@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService : AuthService){
        super({
            clientID: APPLE_CLIENT_ID,
            teamID: APPLE_TEAMID,
            keyID: APPLE_KEYID,
            keyFilePath: APPLE_KEYFILE_PATH,
            callbackURL: APPLE_CALLBACK,
            passReqToCallback: true,
            scope: ['email', 'name'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
      ): Promise<any> {
        const { name, emails } = profile;
        const profileUpdated = {...profile,accessToken,refreshToken}
        // console.log(name, emails, profileUpdated)
        // let user = await this.authService.findByEmail(emails[0].value);
    
        // if (!user) {
        //   user = await this.authService.createSocialUser(
        //     emails[0].value,
        //     'apple',
        //     name.givenName,
        //     name.familyName,
        //   );
        // }
        done(null,profileUpdated)
    }
}