// ! Classic boilerplate type
type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;
type Range<T extends number, K extends number> = Exclude<
  Enumerate<K>,
  Enumerate<T>
>;
export type LevelRange = `${Range<1, 81>}/80`;
export type MappedStat = {
  level: number;
  value: number;
};
