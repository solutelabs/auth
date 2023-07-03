import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  Inject,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthResponse } from './interface';
import {
  FacebookAuthDto,
  GoogleAuthDto,
  LoginDto,
  MagicLinkDto,
  MobileDto,
  SignupDto,
} from './dto';
import { compareHash, generateHash, User } from './../../core/utility';
import { Auth, google } from 'googleapis';
import {
  INTERNAL_SERVER_ERROR,
  INVALID_CREDENTIALS,
  INVALID_TOKEN,
  UNAUTHORIZED,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  USER_ALREADY_EXISTS_WITH_THIS_MOBILE_NUMBER,
  INVALID_COUNTRY_CODE,
} from '../../core/error';
import { PROVIDERS, ROLES } from '../../core/constant';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { UserEntity } from './entity';
import { ClientProxy } from '@nestjs/microservices';
import { MagicLinkResponse } from './model';
import * as crypto from 'crypto';
import {
  REFRESH_JWT_EXPIRES_IN_DAYS,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_SID,
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  JWT_SECRET,
} from 'src/core/environment';
import { OtpService } from './otp/otp.service';
import { Twilio } from 'twilio';
import { CountryService } from '../country/country.service';


@Injectable()
export class AuthService {
  private oauthClient: Auth.OAuth2Client;
  private TwilioClient: Twilio;
  //private TwitClient: Twit;
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly countryService: CountryService,
    //private readonly twitter: TwitterOAuth2Strategy,
    @Inject('MAIL_SERVICE') private readonly client: ClientProxy,
    @Inject('ASSET_SERVICE') private readonly assetClient: ClientProxy,
  ) {
    this.oauthClient = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET);
    this.TwilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  async signup(data: SignupDto): Promise<IAuthResponse> {
    const { email, password, username } = data;
    const user = await this.validateUserEmail(email);
    console.log(user, 'user');
    if (user) {
      throw new BadRequestException('User already exists', USER_ALREADY_EXISTS);
    }
    const hashedPassword = await generateHash(password);
    const createUser = this.userRepository.create({
      email: email,
      password: hashedPassword,
      username: username,
      role: ROLES.USER,
    });
    const saveUser = await this.userRepository.save(createUser);

    if (!saveUser) {
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }

    const payload = {
      id: saveUser.id,
      role: saveUser.role,
      is_active: saveUser.is_active,
    };

    this.assetClient.emit('user:create', payload);

    return this.getAuthResponse(saveUser.id, saveUser.role);
  }

  /**
   * @author
   * @param {object} data - LoginDto
   * @returns {object} IAuthResponse
   * @description Authenticate user
   */
  async login(data: LoginDto): Promise<IAuthResponse> {
    const user = await this.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const isPasswordValid = await compareHash(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    if (!user.is_active) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }
    return this.getAuthResponse(user.id, user.role);
  }

  async GoogleAuthSignUp(data) {
    try {
      const tokenInfo = await this.oauthClient.getTokenInfo(data.accessToken);
      const { email, sub } = tokenInfo;

      if (!data.accessToken && !email) {
        throw new NotFoundException(
          'Whoops, something went wrong. Please try again.',
          INVALID_TOKEN,
        );
      }

      let user = await getRepository(UserEntity).findOne({
        where: {
          email: email,
          google_id: sub,
        },
      });
      const signUpEmail = await getRepository(UserEntity).findOne({
        where: {
          email: email,
        },
      });

      if (!user && signUpEmail) {
        throw new ConflictException(
          'Whoops! This email address is already registered. Please try again.',
        );
      }

      if (!user) {
        const newUser = this.userRepository.create({
          email: email,
          google_id: sub,
          role: ROLES.USER,
          provider: PROVIDERS.GOOGLE,
        });
        user = await getRepository(UserEntity).save(newUser);
        return this.getAuthResponse(user.id, user.role);
      }
      return this.getAuthResponse(user.id, user.role);
    } catch (err) {
      Logger.log('error', err);
      throw err;
    }
  }

  async GoogleAuthSigIn(data) {
    try {
      const tokenInfo = await this.oauthClient.getTokenInfo(data.accessToken);
      const { email, sub } = tokenInfo;

      if (!data.accessToken && !email) {
        throw new NotFoundException(
          'Whoops, something went wrong. Please try again.',
          INVALID_TOKEN,
        );
      }

      const user = await getRepository(UserEntity).findOne({
        where: {
          email: email,
          google_id: sub,
        },
      });
      if (!user) {
        throw new NotFoundException(
          'Whoops, please create your account to login.',
          USER_NOT_FOUND,
        );
      }
      return this.getAuthResponse(user.id, user.role);
    } catch (err) {
      Logger.log('error', err);
      throw err;
    }
  }

  async LinkGoogleAccount(data: any, user: UserEntity) {
    try {
      const id = data.id;
      if (id !== user.id) {
        throw new BadRequestException(
          'You are not authorized to make changes for different user',
        );
      }
      const tokenInfo = await this.oauthClient.getTokenInfo(data.accessToken);
      const { sub } = tokenInfo;
      if (user.provider === PROVIDERS.GOOGLE && user.google_id !== sub) {
        throw new BadRequestException(
          'You have created this account using google signup so you cannot change the google id',
        );
      }
      const googleUser = await this.userRepository.findOne({
        where: {
          google_id: sub,
        },
      });
      if (googleUser.id !== user.id) {
        throw new BadRequestException(
          'this google account is already linked to different account',
        );
      }
      user.google_id = sub;
      await this.userRepository.save(user);
      return 'successfully linked google account';
    } catch (error) {
      Logger.log('error', error);
      throw error;
    }
  }

  async twitterUser(data: any) {
    const { email, id_str, name, screen_name } = data;
    let user: UserEntity;
    if (email) {
      user = await this.validateUserEmail(email);
      if (user) {
        if (user.provider !== PROVIDERS.TWITTER)
          throw new ConflictException(
            'Email is not registered using twitter with the app, try using twitter account having different email id',
          );
        return await this.getAuthResponse(user.id, user.role);
      } else {
        user = this.userRepository.create({
          email,
          twitter_id: id_str,
          firstname: name,
          provider: PROVIDERS.TWITTER,
        });
        user = await this.userRepository.save(user);
        return await this.getAuthResponse(user.id, user.role);
      }
    } else {
      throw new BadRequestException(
        'Your twitter account does not contain required info such as email',
      );
    }
  }

  async LinkTwitterAccount(twitterUser: any, user: UserEntity) {
    try {
      const { id_str } = twitterUser;
      if (user.provider === PROVIDERS.TWITTER && user.twitter_id !== id_str) {
        throw new BadRequestException(
          'You have created this account using twitter signup so you cannot change the twitter id',
        );
      }
      const registeredTwitterUser = await this.userRepository.findOne({
        where: {
          twitter_id: id_str,
        },
      });
      if (registeredTwitterUser.id !== user.id) {
        throw new BadRequestException(
          'this twitter account is already linked to different account',
        );
      }
      user.twitter_id = id_str;
      await this.userRepository.save(user);
      return 'successfully linked twitter account';
    } catch (error) {
      Logger.log('error', error);
      throw error;
    }
  }

  async facebookUser(data:any){
    const { email, id, name } = data;
    let user: UserEntity;
    if (email) {
      user = await this.validateUserEmail(email);
      if (user) {
        if (user.provider !== PROVIDERS.FACEBOOK)
          throw new ConflictException(
            'Email is not registered using facebook with the app, try using facebook account having different email id',
          );
        return await this.getAuthResponse(user.id, user.role);
      } else {
        user = this.userRepository.create({
          email,
          facebook_id: id,
          firstname: name,
          provider: PROVIDERS.FACEBOOK,
        });
        user = await this.userRepository.save(user);
        return await this.getAuthResponse(user.id, user.role);
      }
    } else {
      throw new BadRequestException(
        'Your facebook account does not contain required info such as email',
      );
    }
  }

  async LinkFacebookAccount(facebookUser: any, user: UserEntity) {
    try {
      const { id } = facebookUser;
      if (user.provider === PROVIDERS.FACEBOOK && user.twitter_id !== id) {
        throw new BadRequestException(
          'You have created this account using twitter signup so you cannot change the twitter id',
        );
      }
      const registeredTwitterUser = await this.userRepository.findOne({
        where: {
          facebook_id: id,
        },
      });
      if (registeredTwitterUser.id !== user.id) {
        throw new BadRequestException(
          'this facebook account is already linked to different account',
        );
      }
      user.facebook_id = id;
      await this.userRepository.save(user);
      return 'successfully linked twitter account';
    } catch (error) {
      Logger.log('error', error);
      throw error;
    }
  }

  async generateMagicLink(data: MagicLinkDto): Promise<MagicLinkResponse> {
    const user = await this.findByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User does not exists', USER_NOT_FOUND);
    }

    const token = await this.generateRandomToken();
    await this.userRepository.update({ id: user.id }, { magic_link: token });
    const payload = {
      email: user.email,
      name: user.firstname,
      url: `APP_END_POINT/token/${token}`,
    };

    this.client.emit('mail:generate-magiclink', payload);

    return {
      success: true,
      message: 'Mail sent successfully',
    };
  }

  async loginViaMagicLink(token: string): Promise<IAuthResponse> {
    const user = await this.userRepository.findOne({
      magic_link: token,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Token', INVALID_TOKEN);
    }

    if (!user || !user.is_active) {
      throw new UnauthorizedException();
    }

    await this.userRepository.update({ id: user.id }, { magic_link: null });

    return this.getAuthResponse(user.id, user.role);
  }

  async validateUserEmail(email: string) {
    const user = await this.findByEmail(email);
    return user;
  }

  async validateUserContact(contact: string) {
    const user = await this.findByContact(contact);

    if (user) {
      throw new BadRequestException('User already exists', USER_ALREADY_EXISTS);
    }
  }
  /**
   * @author Sambhav
   * @param {string} email - user 's email
   * @returns {object} UserEntity
   * @description find user by email
   */
  async findByEmail(email: string): Promise<UserEntity | undefined> {
    //console.log('inside findByEmail func')
    try {
      return await this.userRepository.findOne({
        where: { email: email },
      });
    } catch (error) {
      return error;
    }
  }

  /**
   * @author
   * @param {string} id - user id
   * @returns {object} UserEntity
   * @description find user by id
   */
  async findById(id: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }

  /**
   * @author Sambhav
   * @param {string} email - user 's email
   * @returns {object} UserEntity
   * @description find user by email
   */
  async findByEmailAndProvider(
    email: string,
    provider: string,
  ): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: { email: email, provider: provider },
    });
  }

  async createSocialUser(
    email: string,
    provider: string,
    firstname: string,
    lastname: string,
  ): Promise<UserEntity> {
    console.log('creating social user');
    const createUser = this.userRepository.create({
      email: email,
      role: ROLES.USER,
      provider: provider,
      firstname: firstname,
      lastname: lastname,
    });
    const saveUser = await this.userRepository.save(createUser);

    if (!saveUser) {
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }

    return saveUser;
  }

  async generateRandomToken(): Promise<string> {
    try {
      const token = crypto.randomBytes(16).toString('hex');
      return this.isTokenPresentInAnotherUser(token);
    } catch (error) {
      Logger.error(error);
    }
  }

  async isTokenPresentInAnotherUser(token: string): Promise<string> {
    const result = await getRepository(UserEntity).findOne({
      magic_link: token,
    });

    return result ? this.generateRandomToken() : token;
  }

  async getAuthResponse(userId: string, role: string): Promise<IAuthResponse> {
    const payload = {
      user_id: userId,
      role: role,
    };

    return {
      accessToken: this.jwtService.sign(payload, { secret: JWT_SECRET }),
      refreshToken: this.jwtService.sign(
        { user_id: userId },
        { expiresIn: `${REFRESH_JWT_EXPIRES_IN_DAYS}d`, secret: JWT_SECRET },
      ),
      data: {
        ...payload,
      },
    };
  }

  /**
   * @author Sambhav
   * @param {string} contact - user 's contact
   * @returns {object} UserEntity
   * @description find user by contact
   */
  async findByContact(contact: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: { contact: contact },
    });
  }

  /**
   * @author Sambhav
   * @param {object} data - MobileDto
   * @returns {object} IAuthResponse
   * @description Authenticate user
   */
  async updateContact(
    user: UserEntity,
    data: MobileDto,
  ): Promise<IAuthResponse> {
    const userDetails = await this.findByContact(data.contact);

    if (userDetails) {
      throw new BadRequestException(
        'User already exists with this mobile number',
        USER_ALREADY_EXISTS_WITH_THIS_MOBILE_NUMBER,
      );
    }

    // validate otp
    await this.otpService.verifyOtp(data);

    await this.userRepository.update(
      {
        id: user.id,
      },
      { contact: data.contact },
    );

    return this.getAuthResponse(user.id, user.role);
  }

  async refreshToken(refreshToken): Promise<IAuthResponse> {
    const tokenData = this.jwtService.verify(refreshToken);

    const user = await this.findById(tokenData.user_id);

    if (!user) {
      throw new NotFoundException('User not found', USER_NOT_FOUND);
    }

    if (!user.is_active) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    return this.getAuthResponse(user.id, user.role);
  }

  async signupMobile(data: MobileDto): Promise<IAuthResponse> {
    const { country_code, contact } = data;

    await this.validateUserContact(contact);
    // validate otp
    await this.otpService.verifyOtp(data);

    const saveUser = await this.userRepository.save({
      contact: contact,
      country_code: country_code,
    });

    if (!saveUser) {
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }

    return this.getAuthResponse(saveUser.id, saveUser.role);
  }

  /**
   * @author Sambhav
   * @param {object} data - MobileDto
   * @returns {object} IAuthResponse
   * @description Authenticate user
   */
  async loginMobile(data: MobileDto): Promise<IAuthResponse> {
    const user = await this.findByContact(data.contact);

    if (!user) {
      throw new NotFoundException('User not found', USER_NOT_FOUND);
    }

    if (!user.is_active) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    // validate otp
    await this.otpService.verifyOtp(data);

    return this.getAuthResponse(user.id, user.role);
  }

  async appleLogin(data): Promise<IAuthResponse> {
    if (!data.user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const { user } = data.user;
    return this.getAuthResponse(user.id, user.role);
  }

  async whatsappSignup(data: MobileDto): Promise<IAuthResponse> {
    const { country_code, otp, contact } = data;
    const country = await this.countryService.findById(country_code);
    if (!country) {
      throw new NotFoundException('Invalid Country code', INVALID_COUNTRY_CODE);
    }
    await this.validateUserContact(contact);
    const verifiedResponse = await this.TwilioClient.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `${country_code}${contact}`,
        code: otp,
      });
    if (verifiedResponse) {
      if (
        verifiedResponse.valid == false ||
        verifiedResponse.status !== 'approved'
      ) {
        throw new UnauthorizedException('Invalid OTP');
      }
      const saveUser = await this.userRepository.save({
        contact: contact,
        country_code: country_code,
        provider: PROVIDERS.WHATSAPP,
      });
      if (!saveUser) {
        throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
      }

      return this.getAuthResponse(saveUser.id, saveUser.role);
    }
  }

  async loginWhatsApp(data: MobileDto): Promise<IAuthResponse> {
    const { country_code, otp, contact } = data;
    const country = await this.countryService.findById(country_code);
    if (!country) {
      throw new NotFoundException('Invalid Country code', INVALID_COUNTRY_CODE);
    }
    const user = await this.findByContact(data.contact);
    if (!user) {
      throw new NotFoundException('User not found', USER_NOT_FOUND);
    }

    if (!user.is_active) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }
    if (user.provider !== PROVIDERS.WHATSAPP) {
      throw new UnauthorizedException(
        'User is registered with different provider',
      );
    }
    const verifiedResponse = await this.TwilioClient.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `${country_code}${contact}`,
        code: otp,
      });
    if (verifiedResponse) {
      if (
        verifiedResponse.valid == false ||
        verifiedResponse.status !== 'approved'
      ) {
        throw new UnauthorizedException('Invalid OTP');
      }
      return await this.getAuthResponse(user.id, user.role);
    }
  }
}
