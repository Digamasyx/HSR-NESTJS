import { TalentDTO, UpdateTalentDTO } from '../dto/talent.dto';
import { Talent } from '../entity/talent.entity';

export interface ITalent {
  create(body: TalentDTO, charName: string): Promise<{ message: string }>;
  find<T extends number | string>(id_or_char: T): Promise<Talent | Talent[]>;
  remove(id: number): Promise<{ message: string }>;
  removeAll(charName: string): Promise<{ message: string }>;
  update(talent_id: number, updateDTO: UpdateTalentDTO): Promise<string>;
}
