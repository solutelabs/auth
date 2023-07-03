//import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Length, MATCHES, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  PASSWORD_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  ROLES,
} from '../../../core/constant';
import {
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '../../../core/environment';
import { Transform } from 'class-transformer';

export class SignupDto {

  
    @IsString()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    @ApiProperty({type:String, description:'email'})
    email: string;

    @IsString()
    @MinLength(MIN_PASSWORD_LENGTH, {
      message: INVALID_PASSWORD_MESSAGE,
    })
    @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/, {
      message: INVALID_PASSWORD_MESSAGE,
    })
    @ApiProperty({type:String, description:'password'})
    password: string;

    @IsString()
    @ApiProperty({type:String, description:'username'})
    username: string
   
  }


