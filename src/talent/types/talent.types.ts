export type Stats =
  | 'atk'
  | 'hp'
  | 'def'
  | 'spd'
  | 'break_effect'
  | 'crit_dmg'
  | 'crit_rate'
  | 'effect_hit_rate'
  | 'effect_res'
  | 'energy_regen'
  | TypeBoost;
type TypeBoost = `${Types}_dmg_bonus`;
type Types =
  | 'physical'
  | 'fire'
  | 'ice'
  | 'wind'
  | 'lightning'
  | 'quantum'
  | 'imaginary';
