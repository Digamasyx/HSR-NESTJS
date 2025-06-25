import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalProvider {
  formatDate(arg: Date) {
    const day = String(arg.getDate()).padStart(2, '0');
    //? getMonth() retorna 0-11, então adiciona-se 1
    const month = String(arg.getMonth() + 1).padStart(2, '0');
    const hours = String(arg.getHours()).padStart(2, '0');
    const minutes = String(arg.getMinutes()).padStart(2, '0');
    const seconds = String(arg.getSeconds()).padStart(2, '0');
    const year = String(arg.getFullYear());

    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  }

  updateAssign<T>(
    body: any,
    origin: T,
    allowedProp: Array<string>,
  ): {
    changes: { prop: string; from: any; to: any }[];
    alterOrigin: Partial<T>;
  } {
    const safeUpdate: Partial<T> = {};
    const changes: { prop: string; from: any; to: any }[] = [];

    for (const prop of allowedProp) {
      if (body[prop] !== undefined && body[prop] !== origin[prop]) {
        changes.push({
          prop,
          from: origin[prop],
          to: body[prop],
        });
        safeUpdate[prop] = body[prop];
      }
    }

    return { changes, alterOrigin: safeUpdate };
  }
}
