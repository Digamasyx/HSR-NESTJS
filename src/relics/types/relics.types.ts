import { Relics_Type } from '../enum/relics.enum';

export type Relic_Status<T extends Relics_Type> = T extends 'HEAD'
  ? 'HP'
  : T extends 'BODY'
    ? 'HP%' | 'DEF%' | 'ATK%' | 'EFF_RATE' | 'HEALING' | 'CR' | 'CD'
    : T extends 'HAND'
      ? 'ATK'
      : T extends 'FOOT'
        ? 'SPD' | 'DEF%' | 'ATK%' | 'HP%'
        : 'TODO';
