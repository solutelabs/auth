import { forwardRef, Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { UtilityService } from '../../../app/utility';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth.module';
import { LoginEntity, UserEntity } from '../entity';
import { ClientsModule } from '@nestjs/microservices';
import { MAIL_REDIS_URL, MAIL_QUEUE } from '../../../core/environment';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoginEntity,UserEntity]),
    ClientsModule.register([
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
    forwardRef(() => AuthModule),
  ],
  providers: [PasswordService, PasswordController, UtilityService],
})
export class PasswordModule {}
