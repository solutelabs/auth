import { BaseEntity } from '../../utility/entity';
export declare class UserEntity extends BaseEntity {
    email?: string;
    contact?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    reset_password_token?: string;
    profile_pic?: string;
    google_id?: string;
    facebook_id?: string;
    twitter_id?: string;
    apple_id?: string;
    is_active: boolean;
    provider?: string;
    country_code?: string;
    username?: string;
    role: string;
    magic_link?: string;
}
