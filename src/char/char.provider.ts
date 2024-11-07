import { BadRequestException, Injectable } from '@nestjs/common';
import { LevelRange, MappedStat } from './types/char.types';
import { CharDTO } from './dto/char.dto';

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

  nonNullProperties<T extends CharDTO>(arg: Partial<T>): (keyof T)[] {
    const obj = Object.entries(arg);
    const properties: (keyof T)[] = [];
    for (let i = 0; i < obj.length; i++) properties.push(obj[i][0] as keyof T);
    if (typeof properties[0] !== 'string')
      throw new BadRequestException('0 arguments present in body');
    return properties;
  }

  changeProperties(
    idx: (keyof CharDTO)[],
    curr: CharDTO,
    next: Partial<CharDTO>,
  ) {
    for (const i of idx) {
      switch (i) {
        case 'atk':
        case 'def':
        case 'hp':
          if (next[i]) {
            next[i].forEach((nextStat) => {
              const currentStatIdx = curr[i].findIndex(
                (currStat) => currStat.level === nextStat.level,
              );
              if (currentStatIdx !== -1) {
                curr[i][currentStatIdx].value = nextStat.value;
              }
            });
          }
          break;
      }
    }
    return curr;
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
    return JSON.parse(value) as MappedStat[];
  }
}
