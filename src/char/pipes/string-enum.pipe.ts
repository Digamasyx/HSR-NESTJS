import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Paths, Types } from '../enums/char.enum';

@Injectable()
export class ValidateStringEnumPipe implements PipeTransform {
  transform(value: string) {
    const regex = /^[a-zA-Z]+$/;
    const validEnums = [
      ...(Object.values(Paths) as string[]),
      ...(Object.values(Types) as string[]),
    ];

    if (regex.test(value) || validEnums.includes(value.toUpperCase())) {
      return value;
    }

    throw new BadRequestException(
      `Validation failed. The value '${value}' must be alphabetic or match one of the enums: [${validEnums.join(', ')}]`,
    );
  }
}
