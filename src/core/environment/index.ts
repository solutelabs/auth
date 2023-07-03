export const PORT: number = +process.env.PORT;

export const DATABASE_URL = process.env.DATABASE_URL;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN_DAYS = +process.env.JWT_EXPIRES_IN_DAYS;
export const REFRESH_JWT_EXPIRES_IN_DAYS =
  +process.env.REFRESH_JWT_EXPIRES_IN_DAYS;

export const MIN_PASSWORD_LENGTH = +process.env.MIN_PASSWORD_LENGTH;
export const MAX_PASSWORD_LENGTH = +process.env.MAX_PASSWORD_LENGTH;

export const RESET_PASSWORD_SLUG = process.env.RESET_PASSWORD_SLUG;

export const ENVIRONMENT = process.env.ENVIRONMENT;

export const MESSAGE_REDIS_URL = process.env.MESSAGE_REDIS_URL;

export const MESSAGE_QUEUE = process.env.MESSAGE_QUEUE;

export const MAIL_REDIS_URL = process.env.MAIL_REDIS_URL;

export const MAIL_QUEUE = process.env.MAIL_QUEUE;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

export const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;
export const APPLE_TEAMID = process.env.APPLE_TEAMID;
export const APPLE_KEYID = process.env.APPLE_KEYID;
export const APPLE_CALLBACK = process.env.APPLE_CALLBACK;
export const APPLE_KEYFILE_PATH = process.env.APPLE_KEYFILE_PATH;

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_SERVICE_SID = process.env.TWILIO_SERVICE_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

export const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
export const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
export const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
export const TWITTER_ACCESS_TOKEN_SECRET =
  process.env.TWITTER_ACCESS_TOKEN_SECRET;
export const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

export const STRIPE_API = process.env.STRIPE_API;
export const STRIPE_API_VERSION: any = process.env.STRIPE_API_VERSION;

