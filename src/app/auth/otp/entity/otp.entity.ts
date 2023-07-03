import { BaseEntity } from 'src/app/utility/entity';
import { Column, Entity } from 'typeorm';

@Entity('otp')
export class OtpEntity extends BaseEntity {
  @Column('text')
  otp_secret: string;

  @Column({ nullable: true })
  otp_verified_at?: Date;

  @Column('text')
  contact: string;
}
