import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBody } from "@nestjs/swagger";
import { OTP_OPTIONS } from "src/core/constant";
import { JwtAuthGuard, RestThrottlerGuard, User } from "src/core/utility";
import { UserEntity } from "../entity";
import { SendOtpDto, ValidateOtpDto } from "./dto";
import { OtpService } from "./otp.service";

@Controller('otp')
export class OtpController{
    constructor(private readonly otpService:OtpService){}

    @Post('sendOtp')
    @ApiBody({type:SendOtpDto})
    @UseGuards(RestThrottlerGuard)
    async sendOtp(@Body() data: SendOtpDto) {
        try {
            return await this.otpService.createAndSendOtp(data);
        } catch (error) {
            return error
        }
        
    }

    @Post('whatsappSendOtp')
    @ApiBody({type:SendOtpDto})
    @ApiAcceptedResponse({description:'Otp sent successfully'})
    @ApiBadRequestResponse({description:'Invalid Request'})
    @UseGuards(RestThrottlerGuard)
    async whatsappSendOtp(@Body() data: SendOtpDto) {
        try {
            return await this.otpService.createAndSendWhatsAppOtp(data);
        } catch (error) {
            return error
        }
        
    }

    @Post('generateVerifyOtp')
    @UseGuards(RestThrottlerGuard)
    @UseGuards(JwtAuthGuard)
    async generateVerifyOtp(@User() user: UserEntity) {
        const data: SendOtpDto = {
        contact: user.contact,
        mode: OTP_OPTIONS.VERIFY,
        country_code: user.country_code,
        };
        return this.otpService.createAndSendOtp(data);
    }

    @Post('verifyOtp')
    @UseGuards(JwtAuthGuard)
    async verifyOtp(@User() user: UserEntity, @Body() otp: string) {
        const data: ValidateOtpDto = {
        contact: user.contact,
        otp: otp,
        country_code: user.country_code,
        };
        return this.otpService.verifyOtp(data);
    }

    @Post('generateUpdateOtp')
    @UseGuards(RestThrottlerGuard)
    @UseGuards(JwtAuthGuard)
    async generateUpdateOtp(
        @Body() dtoData: SendOtpDto,
    ) {
        const data: SendOtpDto = {
        contact: dtoData.contact,
        mode: OTP_OPTIONS.UPDATE,
        country_code: dtoData.country_code,
        };
        return this.otpService.createAndSendOtp(data);
    }

}