import { BadRequestException, Injectable } from '@nestjs/common';
import { LevelRange, MappedStat } from './types/char.types';
import { Paths, Types } from './enums/char.enum';

@Injectable()
export class CharProvider {
  defineAsc(level: LevelRange) {
    const currLevel = parseInt(level, 10);

    if (currLevel < 1 || currLevel > 80) {
      throw new BadRequestException(
        `Non valid level inserted. Expected: 1 to 80 | Received: ${currLevel}`,
      );
    }
    return Math.min(6, Math.max(0, Math.floor((currLevel - 11) / 10)));
  }

  jsonArrayToString(value: MappedStat[]): string {
    return JSON.stringify(value ?? []);
  }

  stringToJsonArray(value: string): MappedStat[] {
    try {
      const parsed = JSON.parse(value) as any[];
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(
        (item): item is MappedStat =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.level === 'number' &&
          typeof item.value === 'number',
      );
    } catch {
      return [] as MappedStat[];
    }
  }

  isPaths(value: any): value is Paths {
    return Object.values(Paths).includes(value);
  }

  isTypes(value: any): value is Types {
    return Object.values(Types).includes(value);
  }
}
