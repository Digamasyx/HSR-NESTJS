import { BadRequestException } from '@nestjs/common';
import { LightConeService } from '../../src/light-cone/light-cone.service';

describe('LightConeService', () => {
  it('should create a light cone for a valid character', async () => {
    const lcRepo = {
      findOneBy: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockReturnValue({ name: 'The Hike' }),
      save: jest.fn().mockResolvedValue(undefined),
    };
    const charRepo = {
      findOneBy: jest.fn().mockResolvedValue({ name: 'Asta', lightcone: null }),
      save: jest.fn().mockResolvedValue(undefined),
    };
    const lcProvider = { capitalize: jest.fn().mockReturnValue('Asta') };

    const service = new LightConeService(
      lcRepo as any,
      charRepo as any,
      lcProvider as any,
    );

    await expect(
      service.create({ name: 'The Hike' } as any, 'asta'),
    ).resolves.toEqual({
      message: "Light cone with name: 'The Hike' With signaure char: 'Asta'",
    });
    expect(charRepo.save).toHaveBeenCalled();
  });

  it('should throw BadRequestException when character is missing', async () => {
    const lcRepo = {
      findOneBy: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      save: jest.fn(),
    };
    const charRepo = {
      findOneBy: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
    };
    const lcProvider = { capitalize: jest.fn().mockReturnValue('Asta') };

    const service = new LightConeService(
      lcRepo as any,
      charRepo as any,
      lcProvider as any,
    );

    await expect(
      service.create({ name: 'The Hike' } as any, 'asta'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a light cone by name', async () => {
    const lcRepo = {
      findOneBy: jest.fn().mockResolvedValue({ name: 'The Hike' }),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    const charRepo = { findOneBy: jest.fn() };
    const lcProvider = { capitalize: jest.fn() };

    const service = new LightConeService(
      lcRepo as any,
      charRepo as any,
      lcProvider as any,
    );

    await expect(service.remove('The Hike')).resolves.toEqual({
      message: 'Light Cone with name: The Hike was removed.',
    });
  });
});
