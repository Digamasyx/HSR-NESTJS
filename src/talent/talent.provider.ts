import { BadRequestException, Injectable } from '@nestjs/common';
import { Stats } from '@globals/types/stat.types';
import { TalentDTO } from './dto/talent.dto';

@Injectable()
export class TalentProvider {
  checkBody(arg: TalentDTO) {
    function isStats(arg: any): arg is Stats {
      const possibleStats = [
        'atk',
        'hp',
        'def',
        'spd',
        'break_effect',
        'crit_dmg',
        'crit_rate',
        'effect_hit_rate',
        'effect_res',
        'energy_regen',
        'physical_dmg_bonus',
        'fire_dmg_bonus',
        'ice_dmg_bonus',
        'wind_dmg_bonus',
        'lightning_dmg_bonus',
        'quantum_dmg_bonus',
        'imaginary_dmg_bonus',
      ];
      if (possibleStats.includes(arg)) return true;
      throw new BadRequestException(
        `Wrong Stat type inserted.\nWas expected: '${possibleStats.join(', ')}'.\nWas Recieved: ${arg}.`,
      );
    }
    function isValidValue(arg: number) {
      if (arg < 0 || arg > 50)
        throw new BadRequestException(
          `Value inserted can't be ${arg < 0 ? 'negative' : 'too big'}.`,
        );
      return true;
    }

    return isStats(arg.stat) && isValidValue(arg.value);
  }
  isTrueNumber(arg: any): arg is number {
    return /^-?[0-9]+$/.test(arg);
  }
}
