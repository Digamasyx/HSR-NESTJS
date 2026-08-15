import { TalentController } from '../../src/talent/talent.controller';

describe('TalentController', () => {
  it('should delegate create to the service', async () => {
    const talentService = {
      create: jest.fn().mockResolvedValue({ message: 'talent created' }),
    };

    const controller = new TalentController(talentService as any);

    await expect(controller.create({ stat: 'atk', value: 10 } as any, 'Asta')).resolves.toEqual({
      message: 'talent created',
    });
    expect(talentService.create).toHaveBeenCalledWith({ stat: 'atk', value: 10 }, 'Asta');
  });

  it('should delegate find to the service', async () => {
    const talentService = {
      find: jest.fn().mockResolvedValue([{ id: 1 }]),
    };

    const controller = new TalentController(talentService as any);

    await expect(controller.find('Asta')).resolves.toEqual([{ id: 1 }]);
    expect(talentService.find).toHaveBeenCalledWith('Asta');
  });

  it('should delegate remove to the service', async () => {
    const talentService = {
      remove: jest.fn().mockResolvedValue({ message: 'removed' }),
    };

    const controller = new TalentController(talentService as any);

    await expect(controller.remove(1)).resolves.toEqual({ message: 'removed' });
    expect(talentService.remove).toHaveBeenCalledWith(1);
  });

  it('should delegate removeAll to the service', async () => {
    const talentService = {
      removeAll: jest.fn().mockResolvedValue({ message: 'all removed' }),
    };

    const controller = new TalentController(talentService as any);

    await expect(controller.removeAll('Asta')).resolves.toEqual({ message: 'all removed' });
    expect(talentService.removeAll).toHaveBeenCalledWith('Asta');
  });

  it('should delegate update to the service', async () => {
    const talentService = {
      update: jest.fn().mockResolvedValue('updated'),
    };

    const controller = new TalentController(talentService as any);

    await expect(controller.update(1, { stat: 'atk', value: 15 } as any)).resolves.toBe('updated');
    expect(talentService.update).toHaveBeenCalledWith(1, { stat: 'atk', value: 15 });
  });
});
