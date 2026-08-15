import { BadRequestException } from '@nestjs/common';
import { TalentService } from '../../src/talent/talent.service';

describe('TalentService', () => {
  it('should create a talent when the character exists', async () => {
    const talentRepo = {
      create: jest.fn().mockReturnValue({ stat: 'atk', value: 10 }),
      save: jest.fn().mockResolvedValue(undefined),
    };
    const charRepo = {
      findOneBy: jest.fn().mockResolvedValue({ name: 'Asta' }),
    };
    const talentProvider = {
      checkBody: jest.fn(),
      isTrueNumber: jest.fn(),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new TalentService(
      talentRepo as any,
      charRepo as any,
      talentProvider as any,
      globalProvider as any,
    );

    await expect(service.create({ stat: 'atk', value: 10 } as any, 'Asta')).resolves.toEqual({
      message: "Talent for 'char': Asta, was created.",
    });
    expect(talentRepo.save).toHaveBeenCalled();
  });

  it('should throw BadRequestException when the character does not exist', async () => {
    const talentRepo = { create: jest.fn(), save: jest.fn() };
    const charRepo = { findOneBy: jest.fn().mockResolvedValue(null) };
    const talentProvider = { checkBody: jest.fn(), isTrueNumber: jest.fn() };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new TalentService(
      talentRepo as any,
      charRepo as any,
      talentProvider as any,
      globalProvider as any,
    );

    await expect(service.create({ stat: 'atk', value: 10 } as any, 'Ghost')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return a talent by character name', async () => {
    const talentRepo = {
      createQueryBuilder: jest.fn().mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1, stat: 'atk' }]),
      }),
    };
    const charRepo = { findOneBy: jest.fn() };
    const talentProvider = { checkBody: jest.fn(), isTrueNumber: jest.fn().mockReturnValue(false) };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new TalentService(
      talentRepo as any,
      charRepo as any,
      talentProvider as any,
      globalProvider as any,
    );

    await expect(service.find('Asta')).resolves.toEqual([{ id: 1, stat: 'atk' }]);
  });

  it('should throw BadRequestException when talent ID is invalid', async () => {
    const talentRepo = { createQueryBuilder: jest.fn() };
    const charRepo = { findOneBy: jest.fn() };
    const talentProvider = { checkBody: jest.fn(), isTrueNumber: jest.fn().mockReturnValue(false) };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new TalentService(
      talentRepo as any,
      charRepo as any,
      talentProvider as any,
      globalProvider as any,
    );

    await expect(service.find('')).rejects.toThrow(BadRequestException);
  });

  it('should remove a talent by id', async () => {
    const talentRepo = {
      findOneBy: jest.fn().mockResolvedValue({ talent_id: 1, char: { name: 'Asta' } }),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    const charRepo = { findOneBy: jest.fn() };
    const talentProvider = { checkBody: jest.fn(), isTrueNumber: jest.fn() };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new TalentService(
      talentRepo as any,
      charRepo as any,
      talentProvider as any,
      globalProvider as any,
    );

    await expect(service.remove(1)).resolves.toEqual({
      message: 'The talent associated with the Char: Asta was removed.',
    });
  });

  it('should return a not found when talent does not exist', async () => {
    const talentRepo = {
      findOneBy: jest.fn().mockResolvedValue(null),
      remove: jest.fn(),
    };
    const charRepo = { findOneBy: jest.fn() };
    const talentProvider = { checkBody: jest.fn(), isTrueNumber: jest.fn() };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new TalentService(
      talentRepo as any,
      charRepo as any,
      talentProvider as any,
      globalProvider as any,
    );

    await expect(service.remove(1)).rejects.toThrow(BadRequestException);
  });

  it('should update a talent and return the update message', async () => {
    const talentRepo = {
      findOneBy: jest.fn().mockResolvedValue({ talent_id: 1, effect: 'ATK', stat: 'atk', value: 5, multiplicative: false }),
      save: jest.fn().mockResolvedValue(undefined),
    };
    const charRepo = { findOneBy: jest.fn() };
    const talentProvider = { checkBody: jest.fn(), isTrueNumber: jest.fn().mockReturnValue(true) };
    const globalProvider = {
      updateAssign: jest.fn().mockReturnValue({
        changes: [{ prop: 'value', from: 5, to: 10 }],
        alterOrigin: { value: 10 },
      }),
    };

    const service = new TalentService(
      talentRepo as any,
      charRepo as any,
      talentProvider as any,
      globalProvider as any,
    );

    await expect(service.update(1, { value: 10 } as any)).resolves.toContain('Talent 1 updated.');
  });
});
