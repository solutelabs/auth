import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import {
  JWT_SECRET,
  JWT_EXPIRES_IN_DAYS,
  MAIL_QUEUE,
  MAIL_REDIS_URL,
} from './../../core/environment';
import { GoogleStrategy, JwtStrategy, AppleStrategy } from './strategy';
import { OtpModule } from './otp/otp.module';
import { PasswordModule } from './password/password.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginEntity, UserEntity } from './entity';
import { AuthController } from './auth.controller';
import { ClientsModule } from '@nestjs/microservices';
import {
  AppleOAuth2Strategy,
  FacebookOAuth2Strategy,
  TwitterOAuth2Strategy,
} from './strategy/strategies';
import { CountryModule } from '../country/country.module';
import { SessionModule } from 'nestjs-session';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      verifyOptions: {
        algorithms: ['HS256'],
      },
      signOptions: { expiresIn: `${JWT_EXPIRES_IN_DAYS}d` },
    }),
    SessionModule.forRoot({
      session: {
        secret: 'your_secret_key_here',
        resave: true,
        saveUninitialized: true,
      },
    }),
    TypeOrmModule.forFeature([UserEntity]),
    ClientsModule.register([
      {
        name: 'ASSET_SERVICE',
        transport: 1,
        options: {
          url: MAIL_REDIS_URL,
          queue: 'asset_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'MAIL_SERVICE',
        transport: 1,
        options: {
          url: MAIL_REDIS_URL,
          queue: MAIL_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    PasswordModule,
    OtpModule,
    CountryModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    TwitterOAuth2Strategy,
    AppleOAuth2Strategy,
    FacebookOAuth2Strategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
