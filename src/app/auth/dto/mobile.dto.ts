// import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

//@InputType()
export class MobileDto {
  //@Field()
  @ApiProperty({type:String, description:'mobile_number'})
  contact: string;

  //@Field()
  @ApiProperty({type:String, description:'country_code'})
  country_code: string;

  //@Field()
  @ApiProperty({type:String, description:'otp'})
  otp: string;
}
