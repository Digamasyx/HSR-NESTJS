import { BadRequestException, Injectable } from '@nestjs/common';
import { LevelRange, MappedStat } from './types/char.types';
import { Paths, Types } from './enums/char.enum';

@Injectable()
export class CharProvider {
  defineAsc(level: LevelRange) {
    const currLevel = parseInt(level.replace('/80', ''), 10);

    if (currLevel < 1 || currLevel > 80) {
      throw new BadRequestException(
        `Non valid level inserted. Expected: 1 to 80 | Received: ${currLevel}`,
      );
    }

    if (currLevel <= 20) return 0;
    if (currLevel <= 30) return 1;
    if (currLevel <= 40) return 2;
    if (currLevel <= 50) return 3;
    if (currLevel <= 60) return 4;
    if (currLevel <= 70) return 5;
    return 6;
  }

  jsonArrayToString(value: MappedStat[]): string {
    let jsonArr = '[';
    for (let i = 0; i < value.length; i++) {
      jsonArr += JSON.stringify(value[i]);
      if (i < value.length - 1) {
        jsonArr += ',';
      }
    }
    jsonArr += ']';
    return jsonArr;
  }

  stringToJsonArray(value: string): MappedStat[] {
    try {
      return JSON.parse(value) as MappedStat[];
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
