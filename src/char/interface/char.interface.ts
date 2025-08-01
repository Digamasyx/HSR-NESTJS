﻿import { CharDTO, UpdateCharDTO } from '../dto/char.dto';
import { Char } from '../entity/char.entity';

export interface IChar {
  create(body: CharDTO): Promise<{ message: string }>;
  findAll(page: number, limit: number): Promise<Char[]>;
  find(name: string): Promise<Char | Char[]>;
  remove(name: string): Promise<{ message: string }>;
  update(body: UpdateCharDTO, name: string): Promise<string>;
}
