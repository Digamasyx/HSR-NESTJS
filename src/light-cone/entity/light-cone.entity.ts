import { Char } from '@char/entity/char.entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Effects } from '../types/effect.type';

@Entity()
export class LightCone {
  @PrimaryColumn({
    unique: true,
  })
  name: string;

  @Column({
    type: 'json',
  })
  stats: {
    atk: number;
    def: number;
    hp: number;
  };

  @Column({
    type: 'json',
  })
  effect: Effects;

  @OneToOne(() => Char, (char) => char.signature_lc)
  char: Char;
}
