import { UserProps } from './user.enum';

export type CreatePassArg = { name: string };
export type CreateWoPassArg = { name: string; pass: string };
export type DeleteArg = { name: string; uuid: string };
export type UpdateArg<K extends object> = { properties: (keyof K)[] };

export type ArgType<
  T extends UserProps,
  K extends object,
> = T extends UserProps.create_pass
  ? CreatePassArg
  : T extends UserProps.create_wo_pass
    ? CreateWoPassArg
    : T extends UserProps.delete
      ? DeleteArg
      : T extends UserProps.update
        ? UpdateArg<K>
        : never;
