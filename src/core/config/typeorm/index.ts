import path from 'path';
import { LoginEntity, RoleEntity, UserEntity } from '../../../app/auth/entity';
import { OtpEntity } from '../../../app/auth/otp/entity';
import { CountryEntity } from '../../../app/country/entity';
import { ConnectionOptions } from 'typeorm';
import { DATABASE_URL, ENVIRONMENT } from '../../environment';

const config: ConnectionOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  entities: [RoleEntity, LoginEntity, OtpEntity, CountryEntity, UserEntity],

  logging: ENVIRONMENT === 'local',
  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  // migrationsRun: true,

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [path.join(__dirname, '../../../migrations/*{.ts,.js}')],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
    entitiesDir: 'src/app/**/entity/*.entity{.ts,.js}',
  },
};

export = config;
