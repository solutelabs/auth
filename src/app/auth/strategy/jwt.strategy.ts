import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from '../../../core/environment';
import { ITokenPayload } from '../interface';
import { LoginEntity, UserEntity } from '../entity';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: ITokenPayload): Promise<UserEntity> {
    const user = await this.authService.findById(payload.user_id);
    console.log(user,'user from strategy')
    if (!user || !user.is_active) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
