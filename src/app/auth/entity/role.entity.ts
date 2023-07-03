import { BaseEntity } from '../../utility/entity';
import { Entity, Column } from 'typeorm';

@Entity('role')
export class RoleEntity extends BaseEntity {
  @Column('text', { unique: true })
  role: string;
}
