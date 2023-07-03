import { forwardRef, Module } from '@nestjs/common';
// import { OtpResolver } from './otp.resolver';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from '../../country/country.module';
import { OtpEntity } from './entity';
import {
  JWT_SECRET,
  JWT_EXPIRES_IN_DAYS,
  MESSAGE_QUEUE,
  MESSAGE_REDIS_URL,
} from '../../../core/environment';
import { JwtModule } from '@nestjs/jwt';
import { LoginEntity } from '../entity';
import { ClientsModule } from '@nestjs/microservices';
import { AuthModule } from '../auth.module';
import { OtpController } from './otp.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      verifyOptions: {
        algorithms: ['HS256'],
      },
      signOptions: { expiresIn: `${JWT_EXPIRES_IN_DAYS}d` },
    }),
    TypeOrmModule.forFeature([OtpEntity, LoginEntity]),
    ClientsModule.register([
      {
        name: 'MESSAGE_SERVICE',
        transport: 1,
        options: {
          url: MESSAGE_REDIS_URL,
          queue: MESSAGE_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    CountryModule,
    forwardRef(() => AuthModule),
  ],
  controllers:[OtpController],
  providers: [ OtpService],
  exports: [OtpService],
})
export class OtpModule {}
