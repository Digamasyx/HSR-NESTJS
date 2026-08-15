import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { FileService } from '../../src/file/file.service';

describe('FileService', () => {
  it('should upload the file when user is logged and character exists', async () => {
    const filesRepo = {
      create: jest.fn().mockReturnValue({ id: 1 }),
      findOneBy: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
    };
    const charRepo = {
      findOneBy: jest.fn().mockResolvedValue({ name: 'Asta' }),
    };

    const service = new FileService(filesRepo as any, charRepo as any);

    await expect(
      service.addFile({
        name: 'Asta',
        imageType: 'icon',
        filename: 'hero.png',
        path: '/tmp/hero.png',
        req: { login_status: true } as any,
      }),
    ).resolves.toEqual({
      message: 'File with name: Asta was created and associated to Char: Asta.',
      filePath: '/tmp/hero.png',
    });
  });

  it('should throw UnauthorizedException when req.login_status is false', async () => {
    const filesRepo = { create: jest.fn(), findOneBy: jest.fn(), save: jest.fn() };
    const charRepo = { findOneBy: jest.fn() };

    const service = new FileService(filesRepo as any, charRepo as any);

    await expect(
      service.addFile({
        name: 'Asta',
        imageType: 'icon',
        filename: 'hero.png',
        path: '/tmp/hero.png',
        req: { login_status: false } as any,
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw BadRequestException when character does not exist', async () => {
    const filesRepo = { create: jest.fn(), findOneBy: jest.fn(), save: jest.fn() };
    const charRepo = { findOneBy: jest.fn().mockResolvedValue(null) };

    const service = new FileService(filesRepo as any, charRepo as any);

    await expect(
      service.addFile({
        name: 'Ghost',
        imageType: 'icon',
        filename: 'hero.png',
        path: '/tmp/hero.png',
        req: { login_status: true } as any,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
