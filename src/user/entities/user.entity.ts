import { AccessLevel } from 'src/roles/roles.enum';
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
}
