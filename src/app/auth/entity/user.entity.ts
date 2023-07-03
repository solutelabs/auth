import { BaseEntity } from '../../utility/entity';
import { Entity, Column } from 'typeorm';
import { PROVIDERS, ROLES } from 'src/core/constant';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column('text', { unique: true, nullable:true })
  email?: string;

  @Column('text', {
    nullable: true,
  })
  contact?: string;

  @Column('text', {
    nullable: true,
  })
  password?: string;

  @Column('text', {
    nullable: true,
  })
  firstname?: string;

  @Column('text', {
    nullable: true,
  })
  lastname?: string;

  @Column('text', {
    nullable: true,
  })
  reset_password_token?: string;

  @Column('text', {
    nullable: true,
  })
  profile_pic?: string;

  @Column('text', {
    nullable: true,
    unique: true,
  })
  google_id?: string;

  @Column('text', {
    nullable: true,
    unique: true,
  })
  facebook_id?: string;

  @Column('text', {
    nullable: true,
    unique: true,
  })
  twitter_id?: string;;

  @Column('text', {
    nullable: true,
    unique: true,
  })
  apple_id?: string;

  @Column('boolean', { default: true })
  is_active: boolean;

  @Column('text',{
    nullable:true
  })
  provider?: string;

  @Column('text', {
    nullable: true,
  })
  country_code?: string;

  @Column('text', { unique: true, nullable:true })
  username?: string;

  @Column('text',{default:ROLES.USER})
  role: string;

  @Column('text', { nullable: true })
  magic_link?: string;

  @Column('text',{default:null,unique:true,nullable:true})
  stripe_customer_id?: string;

}
