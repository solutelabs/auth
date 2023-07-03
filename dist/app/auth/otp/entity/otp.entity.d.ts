import { BaseEntity } from 'src/app/utility/entity';
export declare class OtpEntity extends BaseEntity {
    otp_secret: string;
    otp_verified_at?: Date;
    contact: string;
}
