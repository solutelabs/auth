import { BaseEntity } from 'src/app/utility/entity';
export declare class LoginEntity extends BaseEntity {
    email: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    contact?: string;
    country_id?: string;
    role: string;
    reset_password_token?: string;
    is_active: boolean;
    provider?: string;
    magic_link?: string;
}
