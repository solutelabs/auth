// import { UseGuards } from '@nestjs/common';
// import { Resolver, Mutation, Args } from '@nestjs/graphql';
// import { OTP_OPTIONS } from '../../../core/constant';
// import { CommonResponse } from '../../../app/utility/model';
// import { RestThrottlerGuard, JwtAuthGuard, User } from '../../../core/utility';
// import { LoginEntity } from '../entity';
// import { SendOtpDto, ValidateOtpDto } from './dto/index';
// import { OtpService } from './otp.service';

// @Resolver()
// export class OtpResolver {
//   constructor(private otpService: OtpService) {}

//   @UseGuards(RestThrottlerGuard)
//   @Mutation(() => CommonResponse)
//   async sendOtp(@Args('input', { type: () => SendOtpDto }) data: SendOtpDto) {
//     return this.otpService.createAndSendOtp(data);
//   }

//   @Mutation(() => CommonResponse)
//   @UseGuards(RestThrottlerGuard)
//   @UseGuards(JwtAuthGuard)
//   async generateVerifyOtp(@User() user: LoginEntity) {
//     const data: SendOtpDto = {
//       contact: user.contact,
//       mode: OTP_OPTIONS.VERIFY,
//       country_id: user.country_id,
//     };
//     return this.otpService.createAndSendOtp(data);
//   }

//   @Mutation(() => CommonResponse)
//   @UseGuards(JwtAuthGuard)
//   async verifyOtp(@User() user: LoginEntity, @Args('otp') otp: string) {
//     const data: ValidateOtpDto = {
//       contact: user.contact,
//       otp: otp,
//       country_id: user.country_id,
//     };
//     return this.otpService.verifyOtp(data);
//   }

//   @UseGuards(RestThrottlerGuard)
//   @UseGuards(JwtAuthGuard)
//   @Mutation(() => CommonResponse)
//   async generateUpdateOtp(
//     @Args('input', { type: () => SendOtpDto }) dtoData: SendOtpDto,
//   ) {
//     const data: SendOtpDto = {
//       contact: dtoData.contact,
//       mode: OTP_OPTIONS.UPDATE,
//       country_id: dtoData.country_id,
//     };
//     return this.otpService.createAndSendOtp(data);
//   }
// }
