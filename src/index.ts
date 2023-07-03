import {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN_DAYS,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  RESET_PASSWORD_SLUG,
  ENVIRONMENT,
  MESSAGE_REDIS_URL,
  MESSAGE_QUEUE,
  MAIL_REDIS_URL,
  MAIL_QUEUE,
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  GOOGLE_CALLBACK_URL,
} from './core/environment';

export const start = async () => {
  /*if (!PORT) {
    throw new Error('Port must be defined');
  }

  if (!DATABASE_URL) {
    throw new Error('database url must be defined');
  }

  if (!JWT_SECRET) {
    throw new Error('jwt secret must be defined');
  }

  if (!JWT_EXPIRES_IN_DAYS) {
    throw new Error('jwt expires in days be defined');
  }

  if (!MIN_PASSWORD_LENGTH) {
    throw new Error('min password length must be defined');
  }

  if (!MAX_PASSWORD_LENGTH) {
    throw new Error('max password length must be defined');
  }

  if (!RESET_PASSWORD_SLUG) {
    throw new Error('reset password slug must be defined');
  }

  if (!ENVIRONMENT) {
    throw new Error('environment must be defined');
  }

  if (!MESSAGE_REDIS_URL) {
    throw new Error('message redis url must be defined');
  }

  if (!MESSAGE_QUEUE) {
    throw new Error('message queue must be defined');
  }

  if (!MAIL_REDIS_URL) {
    throw new Error('mail redis url must be defined');
  }

  if (!MAIL_QUEUE) {
    throw new Error('mail queue must be defined');
  }

  if (!GOOGLE_CALLBACK_URL) {
    throw new Error('google callback url must be defined');
  }

  if (!GOOGLE_CLIENT_ID) {
    throw new Error('google client id must be defined');
  }

  if (!GOOGLE_SECRET) {
    throw new Error('google secret must be defined');
  }*/
};
