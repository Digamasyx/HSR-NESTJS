import { CharController } from '../../src/char/char.controller';

describe('CharController', () => {
  it('should delegate create to the service', () => {
    const charService = { create: jest.fn().mockResolvedValue({ message: 'created' }) };
    const controller = new CharController(charService as any);

    return controller.create({ name: 'Asta' } as any).then((result) => {
      expect(result).toEqual({ message: 'created' });
      expect(charService.create).toHaveBeenCalledWith({ name: 'Asta' });
    });
  });

  it('should delegate find to the service', () => {
    const charService = { find: jest.fn().mockResolvedValue({ name: 'Asta' }) };
    const controller = new CharController(charService as any);

    return controller.find('Asta').then((result) => {
      expect(result).toEqual({ name: 'Asta' });
      expect(charService.find).toHaveBeenCalledWith('Asta');
    });
  });

  it('should delegate findAll to the service', () => {
    const charService = { findAll: jest.fn().mockResolvedValue([{ name: 'Asta' }]) };
    const controller = new CharController(charService as any);

    return controller.findAll(1, 10).then((result) => {
      expect(result).toEqual([{ name: 'Asta' }]);
      expect(charService.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  it('should delegate remove to the service', () => {
    const charService = { remove: jest.fn().mockResolvedValue({ message: 'removed' }) };
    const controller = new CharController(charService as any);

    return controller.remove('Asta').then((result) => {
      expect(result).toEqual({ message: 'removed' });
      expect(charService.remove).toHaveBeenCalledWith('Asta');
    });
  });

  it('should delegate update to the service', () => {
    const charService = { update: jest.fn().mockResolvedValue('updated') };
    const controller = new CharController(charService as any);

    return controller.update({ level: '20/80' } as any, 'Asta').then((result) => {
      expect(result).toBe('updated');
      expect(charService.update).toHaveBeenCalledWith({ level: '20/80' }, 'Asta');
    });
  });
});
