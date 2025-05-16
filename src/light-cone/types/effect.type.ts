import { Stats } from '@globals/types/stat.types';

export type Effects = {
  base_effect: Stats;
  base_effect_type: 'increase' | 'decrease';
  stacks: boolean;
  max_stacks: number;
  duration: number;
  additional_effects?: Effects;
};
