import { UserController } from '../../src/user/user.controller';

describe('UserController', () => {
  it('should delegate create to the service', async () => {
    const userService = {
      create: jest.fn().mockResolvedValue({ message: 'created' }),
    };

    const controller = new UserController(userService as any);
    const req = { login_status: false } as any;

    await expect(
      controller.create({ name: 'alice' } as any, req),
    ).resolves.toEqual({ message: 'created' });
    expect(userService.create).toHaveBeenCalledWith({ name: 'alice' }, req);
  });

  it('should delegate findAll to the service', async () => {
    const userService = {
      findAll: jest.fn().mockResolvedValue([{ name: 'alice' }]),
    };

    const controller = new UserController(userService as any);
    const req = { login_status: true } as any;

    await expect(
      controller.findAll(req, { page: 1, limit: 10 }),
    ).resolves.toEqual([{ name: 'alice' }]);
    expect(userService.findAll).toHaveBeenCalledWith(req, {
      page: 1,
      limit: 10,
    });
  });

  it('should delegate find to the service', async () => {
    const userService = {
      find: jest.fn().mockResolvedValue({ name: 'alice' }),
    };

    const controller = new UserController(userService as any);
    const req = { login_status: true } as any;

    await expect(controller.find('alice', req)).resolves.toEqual({
      name: 'alice',
    });
    expect(userService.find).toHaveBeenCalledWith('alice', req);
  });

  it('should delegate delete to the service', async () => {
    const userService = {
      delete: jest.fn().mockResolvedValue({ message: 'deleted' }),
    };

    const controller = new UserController(userService as any);
    const req = { login_status: true } as any;

    await expect(controller.delete('alice', req)).resolves.toEqual({
      message: 'deleted',
    });
    expect(userService.delete).toHaveBeenCalledWith('alice', req);
  });

  it('should delegate update to the service', async () => {
    const userService = {
      update: jest.fn().mockResolvedValue({ message: 'User alice updated.' }),
    };

    const controller = new UserController(userService as any);
    const req = { login_status: true } as any;

    await expect(
      controller.update({ name: 'alice' } as any, 'alice', req),
    ).resolves.toEqual({ message: 'User alice updated.' });
    expect(userService.update).toHaveBeenCalledWith(
      { name: 'alice' },
      'alice',
      req,
    );
  });
});
