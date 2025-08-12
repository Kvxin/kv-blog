import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@app/common/entities/base.entity';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ type: 'enum', enum: ['admin', 'editor', 'viewer'], default: 'viewer' })
  role: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;
} 