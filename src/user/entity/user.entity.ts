import { AccessLevel } from '@roles/roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_uuid: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  pass: string;

  @Column({
    type: 'enum',
    enum: AccessLevel,
    default: AccessLevel.USER,
  })
  access_level: AccessLevel;

  @Column({ default: null, nullable: true, length: 410, select: false })
  twoFacSecret: string;

  @Column({ default: false, type: 'bool' })
  is2FAActivated: boolean;
}
