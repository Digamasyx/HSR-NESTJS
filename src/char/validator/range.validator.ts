import { registerDecorator, ValidationOptions } from 'class-validator';
export function IsLevelRange(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isLevelRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const parts = value.split('/');
          if (parts.length !== 2 || parts[1] !== '80') return false;

          const numemrator = Number(parts[0]);
          return (
            Number.isInteger(numemrator) &&
            numemrator >= 1 &&
            numemrator <= 80 &&
            parts[0] == String(numemrator)
          );
        },
        defaultMessage(args) {
          return `${args.property} deve estar no formato "X/80", com X entre 1 e 80.`;
        },
      },
    });
  };
}
