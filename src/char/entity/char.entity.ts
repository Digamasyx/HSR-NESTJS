import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Paths, Types } from '../enums/char.enum';
import { Talent } from '@talent/entity/talent.entity';
import { LevelRange } from '../types/char.types';
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

  @Column({
    type: 'varchar',
    length: 1000,
  })
  atk: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  def: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  hp: string;

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

  @OneToOne(() => LightCone, (lc) => lc.char)
  signature_lc: LightCone;

  @OneToMany(() => Files, (files) => files.char)
  files: Files[];

  @OneToMany(() => Talent, (talent) => talent.char)
  talent: Talent[];
}
