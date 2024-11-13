import { TalentDTO } from '../dto/talent.dto';

export interface ITalent {
  create(body: TalentDTO): Promise<{ message: string }>;
}
