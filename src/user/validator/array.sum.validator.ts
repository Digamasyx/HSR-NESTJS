import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
export function IsSumBetween(
  min: number,
  max: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSumBetween',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min, max],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const sum = value.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
          const [minConstraint, maxConstraint] = args.constraints;

          return sum >= minConstraint && sum <= maxConstraint;
        },
        defaultMessage(args) {
          const [minConstraint, maxConstraint] = args.constraints;
          if (minConstraint === maxConstraint) {
            return `A soma dos elementos de ${args.property} deve ser exatamente ${minConstraint}.`;
          }
          return `A soma dos elementos de ${args.property} deve estar entre ${minConstraint} e ${maxConstraint}.`;
        },
      },
    });
  };
}
