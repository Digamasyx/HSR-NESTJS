import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Effect } from '../enums/talent.enum';
import { Char } from 'src/char/entity/char.entity';
import { Stats } from '../types/talent.types';

@Entity()
export class Talent {
  @PrimaryGeneratedColumn()
  talent_id: number;

  @Column({
    type: 'enum',
    enum: Effect,
  })
  effect: Effect;

  @Column()
  stat: Stats;

  @Column({
    type: 'int',
  })
  value: number;

  @Column({
    type: 'bool',
  })
  multiplicative: boolean;

  @ManyToOne(() => Char, (char) => char.talent)
  char: Char;
}
