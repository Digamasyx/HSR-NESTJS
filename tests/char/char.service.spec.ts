import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CharService } from '../../src/char/char.service';

describe('CharService', () => {
  it('should create a character when it does not already exist', async () => {
    const charRepo = {
      findOneBy: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockReturnValue({ name: 'Asta', level: '20/80' }),
      insert: jest.fn().mockResolvedValue(undefined),
    };
    const charProvider = {
      defineAsc: jest.fn().mockReturnValue(0),
      isPaths: jest.fn().mockReturnValue(false),
      isTypes: jest.fn().mockReturnValue(false),
    };
    const globalProvider = {
      updateAssign: jest.fn(),
    };

    const service = new CharService(charRepo as any, charProvider as any, globalProvider as any);

    await expect(
      service.create({ name: 'Asta', level: '20/80', path: 'The Hunt', type: 'Wind' } as any),
    ).resolves.toEqual({ message: 'Char with name: Asta was created.' });
    expect(charRepo.insert).toHaveBeenCalled();
  });

  it('should throw BadRequestException when trying to create a duplicate character', async () => {
    const charRepo = {
      findOneBy: jest.fn().mockResolvedValue({ name: 'Asta' }),
      create: jest.fn(),
      insert: jest.fn(),
    };
    const charProvider = {
      defineAsc: jest.fn(),
      isPaths: jest.fn(),
      isTypes: jest.fn(),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new CharService(charRepo as any, charProvider as any, globalProvider as any);

    await expect(
      service.create({ name: 'Asta', level: '20/80' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return a single character when searching by name', async () => {
    const charRepo = {
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getOne: jest.fn().mockResolvedValue({ name: 'Asta' }),
      }),
    };
    const charProvider = {
      defineAsc: jest.fn(),
      isPaths: jest.fn().mockReturnValue(false),
      isTypes: jest.fn().mockReturnValue(false),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new CharService(charRepo as any, charProvider as any, globalProvider as any);

    await expect(service.find('Asta')).resolves.toEqual({ name: 'Asta' });
  });

  it('should throw BadRequestException for empty name search', async () => {
    const charRepo = { createQueryBuilder: jest.fn() };
    const charProvider = {
      defineAsc: jest.fn(),
      isPaths: jest.fn(),
      isTypes: jest.fn(),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new CharService(charRepo as any, charProvider as any, globalProvider as any);

    await expect(service.find('')).rejects.toThrow(BadRequestException);
  });

  it('should return all characters paginated', async () => {
    const charRepo = {
      findAndCount: jest.fn().mockResolvedValue([[{ name: 'Asta' }], 1]),
    };
    const charProvider = { defineAsc: jest.fn(), isPaths: jest.fn(), isTypes: jest.fn() };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new CharService(charRepo as any, charProvider as any, globalProvider as any);

    await expect(service.findAll(1, 10)).resolves.toEqual([{ name: 'Asta' }]);
  });

  it('should throw NotFoundException when there are no characters', async () => {
    const charRepo = {
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
    };
    const charProvider = { defineAsc: jest.fn(), isPaths: jest.fn(), isTypes: jest.fn() };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new CharService(charRepo as any, charProvider as any, globalProvider as any);

    await expect(service.findAll(1, 10)).rejects.toThrow(NotFoundException);
  });

  it('should remove a character by name', async () => {
    const charRepo = {
      findOneBy: jest.fn().mockResolvedValue({ name: 'Asta' }),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    const charProvider = { defineAsc: jest.fn(), isPaths: jest.fn(), isTypes: jest.fn() };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new CharService(charRepo as any, charProvider as any, globalProvider as any);

    await expect(service.remove('Asta')).resolves.toEqual({ message: 'The char with name: Asta was removed.' });
  });
});
