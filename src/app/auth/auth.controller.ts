import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard, User } from 'src/core/utility';
import { AuthService } from './auth.service';
import {
  LoginDto,
  MagicLinkDto,
  MobileDto,
  SignupDto,
  GoogleAuthDto,
  FacebookAuthDto,
} from './dto';
import { UserEntity } from './entity';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IAuthResponse } from './interface';
import { Request } from 'express';
import { UNAUTHORIZED } from 'src/core/error';
import { FACEBOOK_APP_ID, FRONTEND_URL } from 'src/core/environment';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async test() {
    return 'testing';
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  async appleAuth(@Req() req): Promise<any> {
    return HttpStatus.OK;
  }

  @Post('apple/redirect')
  @UseGuards(AuthGuard('apple'))
  async appleAuthRedirect(@Body() payload) {
    if (payload.id_token) return this.authService.appleLogin(payload);
    else
      throw new UnauthorizedException('Unauthorized Token Recieved from Apple');
  }

  @Post('google/signup')
  async GoogleAuthSignUp(@Body() data: GoogleAuthDto) {
    return await this.authService.GoogleAuthSignUp(data);
  }

  @Post('/google/signin')
  async GoogleAuthSignIn(@Body() data: GoogleAuthDto) {
    return await this.authService.GoogleAuthSigIn(data);
  }

  @Post('link/google')
  @UseGuards(JwtAuthGuard)
  async LinkGoogleAccount(@Body() data: any, @User() user: any) {
    return await this.authService.LinkGoogleAccount(data, user);
  }

  @Get('twitter')
  @UseGuards(AuthGuard('twitter'))
  async twitter() {}

  @Get('twitter/callback')
  @UseGuards(AuthGuard('twitter'))
  async twitterRedirect(@Req() req: any, @Res() res: any) {
    if (
      req.session &&
      req.session.originalUrl &&
      req.session.originalUrl === '/api/auth/link/twitter'
    ) {
      const message = await this.authService.LinkTwitterAccount(
        req.user,
        req.session.user,
      );;
      const redirectUrl = `${FRONTEND_URL}?response=${message}`;
      delete req.session.originalUrl;
      delete req.session.user;
      res.redirect(redirectUrl);
    } else {
      let authResponse = JSON.stringify(
        await this.authService.twitterUser({
          email: req.user.email,
          id_str: req.user.id_str,
          name: req.user.name,
          screen_name: req.user.screen_name,
        }),
      );
      const redirectUrl = `${FRONTEND_URL}?response=${authResponse}`;
      res.redirect(redirectUrl);;
    }
  }

  @Post('link/twitter')
  @UseGuards(JwtAuthGuard)
  async LinkTwitterAccount(
    @Req() req: any,
    @Res() res: any,
    @Body() data: any,
  ) {
    if (data.id !== req.user.id) {
      throw new BadRequestException(UNAUTHORIZED);
    }
    const redirectUrl = `/api/auth/twitter?originalUrl=${req.originalUrl}`;
    req.session.user = req.user;
    req.session.originalUrl = req.originalUrl;
    res.redirect(redirectUrl);
  }

  @Get('profile')
  async profile(@Query() userAuth: any, @Res() res: any) {
    userAuth = userAuth.userAuth;
    const user = JSON.parse(userAuth);
    //res.redirectUrl = `http://localhost:3000/signin/response=${}`
    return user;
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebook(){}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(@Req() req:any, @Res() res: any){
    if (
      req.session &&
      req.session.originalUrl &&
      req.session.originalUrl === '/api/auth/link/facebook'
    ) {
      const message = await this.authService.LinkFacebookAccount(
        req.user,
        req.session.user,
      );
      const redirectUrl = `${FRONTEND_URL}?response=${message}`;
      delete req.session.originalUrl;
      delete req.session.user;
      return redirectUrl
    } else {
      console.log(req.user)
      let authResponse = JSON.stringify(
        await this.authService.facebookUser({
          email: req.user.email,
          id: req.user.id,
          name: req.user.name,
        }),
      );
      console.log(authResponse)
      //return authResponse
      const redirectUrl = `${FRONTEND_URL}?response=${authResponse}`;
      res.redirect(redirectUrl);;
    }
  }

  @Post('link/facebook')
  @UseGuards(JwtAuthGuard)
  async LinkFacebookAccount(
    @Req() req: any,
    @Res() res: any,
    @Body() data: any,
  ) {
    if (data.id !== req.user.id) {
      throw new BadRequestException(UNAUTHORIZED);
    }
    const redirectUrl = `/api/auth/facebook?originalUrl=${req.originalUrl}`;
    req.session.user = req.user;
    req.session.originalUrl = req.originalUrl;
    res.redirect(redirectUrl);
  }

  @Post('signup')
  @ApiCreatedResponse({
    description: 'User registered using email/username and password',
  })
  @ApiBody({ type: SignupDto })
  async signup(@Body() data: SignupDto) {
    try {
      return await this.authService.signup(data);
    } catch (error) {
      return error;
    }
  }

  @Post('login')
  @ApiOkResponse({ description: 'User logged in' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  @Post('generateMagicLink')
  @ApiBody({ type: MagicLinkDto })
  async generateMagicLink(@Body() data: MagicLinkDto) {
    return this.authService.generateMagicLink(data);
  }

  @Post('loginViaMagicLink')
  async loginViaMagicLink(@Body() token: string) {
    return this.authService.loginViaMagicLink(token);
  }

  @Post('signupMobile')
  @ApiBody({ type: MobileDto })
  @ApiCreatedResponse({ description: 'Signup Successfully done' })
  @ApiUnauthorizedResponse({ description: 'Invalid Inputs' })
  async signupMobile(@Body() data: MobileDto) {
    return await this.authService.signupMobile(data);
  }

  @Post('loginMobile')
  @ApiBody({ type: MobileDto })
  @ApiUnauthorizedResponse({ description: 'Invalid Inputs' })
  @ApiAcceptedResponse({ description: 'User Log in Success' })
  async loginMobile(@Body() data: MobileDto) {
    return this.authService.loginMobile(data);
  }

  @Post('updateContact')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateContact(@User() user: UserEntity, @Body() data: MobileDto) {
    return this.authService.updateContact(user, data);
  }

  @Post('refreshToken')
  async refreshToken(@Body() refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  @Post('signupWhatsApp')
  @ApiBody({ type: MobileDto })
  @ApiCreatedResponse({ description: 'User signed up via Whatsapp' })
  @ApiUnauthorizedResponse({ description: 'Signing Up Failed' })
  async signupWhatsApp(@Body() data: MobileDto): Promise<IAuthResponse | any> {
    return await this.authService.whatsappSignup(data);
  }

  @Post('loginWhatsApp')
  @ApiBody({ type: MobileDto })
  @ApiCreatedResponse({ description: 'User logged in via Whatsapp' })
  @ApiUnauthorizedResponse({ description: 'Signing in Failed' })
  async loginWhatsapp(@Body() data: MobileDto): Promise<IAuthResponse | any> {
    return await this.authService.loginWhatsApp(data);
  }
}
