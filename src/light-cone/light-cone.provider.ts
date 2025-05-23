import { Injectable } from '@nestjs/common';

@Injectable()
export class LightConeProvider {
  capitalize(arg: string) {
    return arg.charAt(0).toUpperCase() + arg.slice(1).toLowerCase();
  }
}
