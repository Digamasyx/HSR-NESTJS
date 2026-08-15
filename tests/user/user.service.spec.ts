import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../src/user/user.service';

describe('UserService', () => {
  it('should create a user and return message for provided password', async () => {
    const userRepo = {
      create: jest.fn().mockReturnValue({ name: 'alice' }),
      insert: jest.fn().mockResolvedValue(undefined),
    };
    const userProvider = {
      genRandomNormalizedWeights: jest.fn(),
      passHash: jest.fn().mockResolvedValue('hashed-pass'),
      outMessage: jest.fn().mockReturnValue({ message: 'User created' }),
      userStatus: jest.fn(),
      hasPermission: jest.fn(),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new UserService(
      userRepo as any,
      userProvider as any,
      globalProvider as any,
    );

    await expect(
      service.create(
        { name: 'alice', pass: 'plain', includePassInResponse: true } as any,
        { login_status: false } as any,
      ),
    ).resolves.toEqual({ message: expect.any(String) });
    expect(userRepo.insert).toHaveBeenCalled();
  });

  it('should throw BadRequestException when already logged in', async () => {
    const userRepo = { create: jest.fn(), insert: jest.fn() };
    const userProvider = {
      genRandomNormalizedWeights: jest.fn(),
      passHash: jest.fn(),
      outMessage: jest.fn(),
      userStatus: jest.fn(),
      hasPermission: jest.fn(),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new UserService(
      userRepo as any,
      userProvider as any,
      globalProvider as any,
    );

    await expect(
      service.create(
        { name: 'alice', pass: 'plain' } as any,
        { login_status: true, user: { access_level: 1 } } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return public user data for not logged users', async () => {
    const userRepo = {
      findOne: jest
        .fn()
        .mockResolvedValue({ name: 'alice', created_at: new Date() }),
      findOneBy: jest.fn(),
    };
    const userProvider = {
      hasPermission: jest.fn().mockReturnValue({ status: false, level: 'None' }),
      outMessage: jest.fn(),
      passHash: jest.fn(),
      genRandomNormalizedWeights: jest.fn(),
      genRandomString: jest.fn(),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new UserService(
      userRepo as any,
      userProvider as any,
      globalProvider as any,
    );

    await expect(
      service.find('alice', { login_status: false } as any),
    ).resolves.toEqual({
      name: 'alice',
      created_at: expect.any(Date),
    });
  });

  it('should throw NotFoundException when finding a missing user', async () => {
    const userRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      findOneBy: jest.fn(),
    };
    const userProvider = {
      hasPermission: jest.fn().mockReturnValue({ status: false, level: 'None' }),
      outMessage: jest.fn(),
      passHash: jest.fn(),
      genRandomNormalizedWeights: jest.fn(),
      genRandomString: jest.fn(),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new UserService(
      userRepo as any,
      userProvider as any,
      globalProvider as any,
    );

    await expect(
      service.find('ghost', { login_status: false } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return users list filtered by page and limit', async () => {
    const userRepo = {
      createQueryBuilder: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ name: 'alice' }], 1]),
      }),
    };
    const userProvider = {
      hasPermission: jest.fn().mockReturnValue({ status: false, level: 'None' }),
      outMessage: jest.fn(),
      passHash: jest.fn(),
      genRandomNormalizedWeights: jest.fn(),
      genRandomString: jest.fn(),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new UserService(
      userRepo as any,
      userProvider as any,
      globalProvider as any,
    );

    await expect(
      service.findAll({ login_status: false } as any, { page: 1, limit: 10 }),
    ).resolves.toEqual([{ name: 'alice' }]);
  });

  it('should delete a user when it has permission', async () => {
    const userRepo = {
      findOneBy: jest
        .fn()
        .mockResolvedValue({ name: 'alice', user_uuid: 'uuid-1' }),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    const userProvider = {
      hasPermission: jest.fn().mockReturnValue({ status: true, level: 1 }),
      outMessage: jest.fn().mockReturnValue({ message: 'deleted' }),
      passHash: jest.fn(),
      genRandomNormalizedWeights: jest.fn(),
      genRandomString: jest.fn(),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new UserService(
      userRepo as any,
      userProvider as any,
      globalProvider as any,
    );

    await expect(
      service.delete('alice', {
        login_status: true,
        user: { access_level: 1, uuid: 'uuid-1' },
      } as any),
    ).resolves.toEqual({
      message: 'deleted',
    });
  });

  it('should throw UnauthorizedException when user has no permission to delete', async () => {
    const userRepo = {
      findOneBy: jest
        .fn()
        .mockResolvedValue({ name: 'alice', user_uuid: 'uuid-2' }),
    };
    const userProvider = {
      hasPermission: jest.fn().mockReturnValue({ status: false, level: 'None' }),
      outMessage: jest.fn(),
      passHash: jest.fn(),
      genRandomNormalizedWeights: jest.fn(),
      genRandomString: jest.fn(),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new UserService(
      userRepo as any,
      userProvider as any,
      globalProvider as any,
    );

    await expect(
      service.delete('alice', {
        login_status: true,
        user: { access_level: 1, uuid: 'uuid-1' },
      } as any),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should update a user and return a change message', async () => {
    const userRepo = {
      findOneBy: jest.fn().mockResolvedValue({
        name: 'alice',
        pass: 'old-pass',
        user_uuid: 'uuid-1',
      }),
      save: jest.fn().mockResolvedValue(undefined),
    };
    const userProvider = {
      hasPermission: jest.fn().mockReturnValue({ status: true, level: 1 }),
      outMessage: jest.fn(),
      passHash: jest.fn().mockResolvedValue('new-hash'),
      genRandomNormalizedWeights: jest.fn(),
      genRandomString: jest.fn(),
    };
    const globalProvider = {
      updateAssign: jest.fn().mockReturnValue({
        changes: [{ prop: 'name', from: 'alice', to: 'alice2' }],
        alterOrigin: { name: 'alice2' },
      }),
    };

    const service = new UserService(
      userRepo as any,
      userProvider as any,
      globalProvider as any,
    );

    await expect(
      service.update({ name: 'alice2' } as any, 'alice', {
        login_status: true,
        user: { access_level: 1, uuid: 'uuid-1' },
      } as any),
    ).resolves.toEqual({ message: expect.stringContaining('User alice updated') });
  });

  it('should throw ForbiddenException when update request lacks permission', async () => {
    const userRepo = {
      findOneBy: jest
        .fn()
        .mockResolvedValue({ name: 'alice', user_uuid: 'uuid-2' }),
    };
    const userProvider = {
      hasPermission: jest.fn().mockReturnValue({ status: false, level: 'None' }),
      outMessage: jest.fn(),
      passHash: jest.fn(),
      genRandomNormalizedWeights: jest.fn(),
      genRandomString: jest.fn(),
    };
    const globalProvider = { updateAssign: jest.fn() };

    const service = new UserService(
      userRepo as any,
      userProvider as any,
      globalProvider as any,
    );

    await expect(
      service.update({ name: 'new-name' } as any, 'alice', {
        login_status: true,
        user: { access_level: 1, uuid: 'uuid-1' },
      } as any),
    ).rejects.toThrow(ForbiddenException);
  });
});
