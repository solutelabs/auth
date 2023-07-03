import { BaseEntity } from 'src/app/utility/entity';
import { Entity, Column } from 'typeorm';

@Entity('login')
export class LoginEntity extends BaseEntity {
  @Column('text', { unique: true })
  email: string;

  @Column('text', { nullable: true })
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
    unique: true,
  })
  contact?: string;

  @Column('text', {
    nullable: true,
  })
  country_id?: string;

  @Column('text')
  role: string;

  @Column('text', { nullable: true })
  reset_password_token?: string;

  @Column('boolean', { default: true })
  is_active: boolean;

  @Column('text')
  provider?: string;

  @Column('text', { nullable: true })
  magic_link?: string;
}
