import {
  BadRequestException,
  Module,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from './app/auth/auth.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { GraphqlService } from './core/config';
// import { CustomExceptionsFilter } from './core/utility';
import { ThrottlerModule } from '@nestjs/throttler';
import { CountryModule } from './app/country/country.module';
import * as ormconfig from './core/config/typeorm';
import { AdminModule } from './app/admin/admin.module';
import { StripeModule } from 'nestjs-stripe';
import { STRIPE_API, STRIPE_API_VERSION } from './core/environment';
//import { PaymentModule } from './app/payment/payment.module';

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: STRIPE_API,
      apiVersion: STRIPE_API_VERSION
    }),
    TypeOrmModule.forRoot(ormconfig),
    // GraphQLModule.forRootAsync({
    //   useClass: GraphqlService,
    // }),
    AdminModule,
    //PaymentModule,
    TerminusModule,
    AuthModule,
    CountryModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 5,
    }),
  ],
  controllers: [HealthController],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: CustomExceptionsFilter,
    // },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        exceptionFactory: (error: ValidationError[]) =>
          new BadRequestException(error),
      }),
    },
  ],
})
export class AppModule {}
