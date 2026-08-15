import { LightConeController } from '../../src/light-cone/light-cone.controller';

describe('LightConeController', () => {
  it('should delegate create to the service', async () => {
    const lightConeService = {
      create: jest.fn().mockResolvedValue({ message: 'light cone created' }),
    };

    const controller = new LightConeController(lightConeService as any);

    await expect(controller.create({ name: 'A Secret' } as any, 'asta')).resolves.toEqual({
      message: 'light cone created',
    });
    expect(lightConeService.create).toHaveBeenCalledWith({ name: 'A Secret' }, 'asta');
  });
});
