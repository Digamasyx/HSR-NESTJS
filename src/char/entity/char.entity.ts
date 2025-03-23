import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Paths, Types } from '../enums/char.enum';
import { Talent } from 'src/talent/entity/talent.entity';
import { LevelRange } from '../types/char.types';
import { Files } from 'src/file/entity/file.entity';

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

  @OneToMany(() => Files, (files) => files.char)
  files: Files[];

  @OneToMany(() => Talent, (talent) => talent.char)
  talent: Talent[];
}
