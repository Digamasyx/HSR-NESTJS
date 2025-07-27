import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Relics_Type } from '../enum/relics.enum';

@Entity()
export class Relic {
  @PrimaryColumn('varchar', { length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: Relics_Type,
  })
  relics_type: Relics_Type;
}
