// import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//@InputType()
export class LoginDto {
  //@Field()
  //@IsEmail()
  @ApiProperty({type:String, description:'email or username'})
  email: string;

  //@Field()
  @ApiProperty({type:String, description:'password'})
  password: string;
}
