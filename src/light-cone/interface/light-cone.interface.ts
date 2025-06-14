import { LcDTO, UpdateLcDTO } from '../dto/light-cone.dto';
import { LightCone } from '../entity/light-cone.entity';

export interface ILightCone {
  create(body: LcDTO, charname: string): Promise<{ message: string }>;
  update(body: UpdateLcDTO): Promise<{ message: string }>;
  remove(name: string): Promise<{ message: string }>;
  find(name: string): Promise<LightCone>;
  findAll(): Promise<LightCone[]>;
}
