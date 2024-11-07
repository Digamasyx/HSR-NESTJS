import { registerDecorator, ValidationOptions } from 'class-validator';
import { MappedStat } from '../types/char.types';

export function IsNumberArray(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: 'IsNumberArray',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: MappedStat[]) {
          return value.every((val) => typeof val.value === 'number');
        },
      },
    });
}
