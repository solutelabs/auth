import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/app/auth/auth.service';
import { UserEntity } from 'src/app/auth/entity';
import { ITokenPayload } from 'src/app/auth/interface';
import { JWT_SECRET } from '../../../core/environment';;


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: ITokenPayload): Promise<UserEntity> {
    //console.log(payload)
    const user = await this.authService.findById(payload.user_id);
    //console.log('user',user)
    if (!user || !user.is_active) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
