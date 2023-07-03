// import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

//@InputType()
export class MagicLinkDto {
  //@Field()
  @ApiProperty({type:String, description:'email'})
  @IsEmail()
  email: string;
}
