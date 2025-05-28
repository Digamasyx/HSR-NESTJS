import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Paths, Types } from '../enums/char.enum';
import { Talent } from '@talent/entity/talent.entity';
import { LevelRange, MappedStat } from '../types/char.types';
import { Files } from '@file/entity/file.entity';
import { LightCone } from 'src/light-cone/entity/light-cone.entity';

@Entity()
export class Char {
  @PrimaryColumn({
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    default: '1/80',
  })
  level: LevelRange;

  @Column({
    type: 'tinyint',
    default: 0,
    unsigned: true,
  })
  asc: number;

  // TODO: Mudar para JSON
  @Column({
    type: 'json',
  })
  atk: MappedStat[];

  @Column({
    type: 'json',
  })
  def: MappedStat[];

  @Column({
    type: 'json',
  })
  hp: MappedStat[];

  @Column()
  spd: number;

  @Column({
    type: 'enum',
    enum: Paths,
  })
  path: Paths;

  @Column({
    type: 'enum',
    enum: Types,
  })
  type: Types;

  @OneToOne(() => LightCone)
  @JoinColumn()
  lightcone: LightCone;

  @OneToMany(() => Files, (files) => files.char)
  files: Files[];

  @OneToMany(() => Talent, (talent) => talent.char)
  talent: Talent[];
}
