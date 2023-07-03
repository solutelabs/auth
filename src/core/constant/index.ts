import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../environment';

export enum ROLES {
  USER = 'user',
  ADMIN = 'admin'
}

export const PASSWORD_MESSAGE = `Password length must be between ${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH}`;
export const INVALID_PASSWORD_MESSAGE =
  'password must contain one uppercase, lowercase, number and symbol';

export enum OTP_OPTIONS {
  SIGNUP = 'signup',
  LOGIN = 'login',
  UPDATE = 'update',
  VERIFY = 'verify',
}

export enum PROVIDERS{
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
  WHATSAPP = 'whatsapp',
  TWITTER = 'twitter'
}

export enum PAYMENT_STATUS{
  SUCCESS = 'success',
  FAILED = 'failed'
}

export enum COUNTRY{
  AUSTRALIA = 'AU',
  INDIA = 'IN'
}

export enum CURRENCY{
  INDIA = 'rupees',
  AUSTRALIA = 'aud'
}