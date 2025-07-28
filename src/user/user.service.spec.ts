import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UserProvider } from './user.provider';
import { GlobalProvider } from '@globals/provider/global.provider';
import { UserDTO, UpdateUserDTO } from './dto/user.dto';
import { CustomRequest } from '@globals/interface/global.interface';
import { AccessLevel } from '@roles/roles.enum';
import { UserProps } from './types/user.enum';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let userProvider: UserProvider;
  let globalProvider: GlobalProvider;

  // Mock data setup
  const mockUser: User = {
    user_uuid: '123e4567-e89b-12d3-a456-426614174000',
    name: 'testuser',
    created_at: new Date('2023-01-01'),
    pass: 'hashedpassword',
    access_level: AccessLevel.USER,
    twoFacSecret: null,
    is2FAActivated: false,
  };

  const mockAdminRequest: CustomRequest = {
    login_status: true,
    user: {
      uuid: 'admin-uuid',
      access_level: AccessLevel.ADMIN,
      name: 'admin',
    },
  } as CustomRequest;

  const mockUserRequest: CustomRequest = {
    login_status: true,
    user: {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      access_level: AccessLevel.USER,
      name: 'testuser',
    },
  } as CustomRequest;

  const mockNotLoggedRequest: CustomRequest = {
    login_status: false,
  } as CustomRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            insert: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: UserProvider,
          useValue: {
            genRandomNormalizedWeights: jest.fn(),
            genRandomString: jest.fn(),
            passHash: jest.fn(),
            outMessage: jest.fn(),
            userStatus: jest.fn(),
            hasPermission: jest.fn(),
          },
        },
        {
          provide: GlobalProvider,
          useValue: {
            updateAssign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userProvider = module.get<UserProvider>(UserProvider);
    globalProvider = module.get<GlobalProvider>(GlobalProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw BadRequestException if user is logged in', async () => {
      const userDTO: UserDTO = { name: 'testuser' };

      await expect(service.create(userDTO, mockUserRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create user with provided password and return void when log is false', async () => {
      const userDTO: UserDTO = {
        name: 'testuser',
        pass: 'password123',
        log: false,
      };

      jest.spyOn(userProvider, 'passHash').mockResolvedValue('hashedpassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'insert').mockResolvedValue(undefined);

      const result = await service.create(userDTO, mockNotLoggedRequest);

      expect(result).toBeUndefined();
      expect(userProvider.passHash).toHaveBeenCalledWith('password123');
      expect(userRepository.create).toHaveBeenCalledWith({
        ...userDTO,
        pass: 'hashedpassword',
      });
      expect(userRepository.insert).toHaveBeenCalled();
    });

    it('should create user with provided password and return message when log is true', async () => {
      const userDTO: UserDTO = {
        name: 'testuser',
        pass: 'password123',
        log: true,
      };

      const expectedMessage = { message: 'User created successfully' };

      jest.spyOn(userProvider, 'passHash').mockResolvedValue('hashedpassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'insert').mockResolvedValue(undefined);
      jest.spyOn(userProvider, 'outMessage').mockReturnValue(expectedMessage);

      const result = await service.create(userDTO, mockNotLoggedRequest);

      expect(result).toEqual(expectedMessage);
      expect(userProvider.outMessage).toHaveBeenCalledWith(
        UserProps.create_pass,
        { name: 'testuser' },
      );
    });

    it('should create user with random password when no password provided', async () => {
      const userDTO: UserDTO = {
        name: 'testuser',
        log: true,
      };

      const randomWeights = [0.33, 0.33, 0.34];
      const randomPassword = 'randompass123';
      const expectedMessage = { message: 'User created with random password' };

      jest
        .spyOn(userProvider, 'genRandomNormalizedWeights')
        .mockReturnValue(randomWeights);
      jest
        .spyOn(userProvider, 'genRandomString')
        .mockReturnValue(randomPassword);
      jest
        .spyOn(userProvider, 'passHash')
        .mockResolvedValue('hashedrandompass');
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'insert').mockResolvedValue(undefined);
      jest.spyOn(userProvider, 'outMessage').mockReturnValue(expectedMessage);

      const result = await service.create(userDTO, mockNotLoggedRequest);

      expect(result).toEqual(expectedMessage);
      expect(userProvider.genRandomString).toHaveBeenCalledWith(
        12,
        randomWeights,
      );
      expect(userProvider.outMessage).toHaveBeenCalledWith(
        UserProps.create_wo_pass,
        {
          name: 'testuser',
          pass: randomPassword,
        },
      );
    });

    it('should use provided weights for random password generation', async () => {
      const customWeights = [0.5, 0.3, 0.2];
      const userDTO: UserDTO = {
        name: 'testuser',
        weights: customWeights,
        log: true,
      };

      const randomPassword = 'customrandompass';

      jest
        .spyOn(userProvider, 'genRandomString')
        .mockReturnValue(randomPassword);
      jest
        .spyOn(userProvider, 'passHash')
        .mockResolvedValue('hashedcustompass');
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'insert').mockResolvedValue(undefined);
      jest
        .spyOn(userProvider, 'outMessage')
        .mockReturnValue({ message: 'Success' });

      await service.create(userDTO, mockNotLoggedRequest);

      expect(userProvider.genRandomString).toHaveBeenCalledWith(
        12,
        customWeights,
      );
    });
  });

  describe('find', () => {
    it('should return limited user data for not logged users', async () => {
      const limitedUser = {
        name: 'testuser',
        created_at: new Date('2023-01-01'),
      };

      jest.spyOn(userProvider, 'userStatus').mockReturnValue('not_logged');
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(limitedUser as User);

      const result = await service.find('testuser', mockNotLoggedRequest);

      expect(result).toEqual(limitedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'testuser' },
        select: { name: true, created_at: true },
      });
    });

    it('should return limited user data for regular users', async () => {
      const limitedUser = {
        name: 'testuser',
        created_at: new Date('2023-01-01'),
      };

      jest.spyOn(userProvider, 'userStatus').mockReturnValue(AccessLevel.USER);
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(limitedUser as User);

      const result = await service.find('testuser', mockUserRequest);

      expect(result).toEqual(limitedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'testuser' },
        select: { name: true, created_at: true },
      });
    });

    it('should return full user data for admin users', async () => {
      jest.spyOn(userProvider, 'userStatus').mockReturnValue(AccessLevel.ADMIN);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);

      const result = await service.find('testuser', mockAdminRequest);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        name: 'testuser',
      });
    });

    it('should throw NotFoundException when user not found (limited access)', async () => {
      jest.spyOn(userProvider, 'userStatus').mockReturnValue('not_logged');
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.find('nonexistent', mockNotLoggedRequest),
      ).rejects.toThrow(NotFoundException);

      expect(userRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found (admin access)', async () => {
      jest.spyOn(userProvider, 'userStatus').mockReturnValue(AccessLevel.ADMIN);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.find('nonexistent', mockAdminRequest),
      ).rejects.toThrow(NotFoundException);

      expect(userRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const mockUsers = [mockUser];
    const mockQueryBuilder = {
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };

    beforeEach(() => {
      jest
        .spyOn(userRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);
    });

    it('should return limited user data for not logged users', async () => {
      jest.spyOn(userProvider, 'userStatus').mockReturnValue('not_logged');
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await service.findAll(mockNotLoggedRequest, 1, 10);

      expect(result).toEqual(mockUsers);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'user.name',
        'user.created_at',
      ]);
    });

    it('should return full user data for admin users', async () => {
      jest.spyOn(userProvider, 'userStatus').mockReturnValue(AccessLevel.ADMIN);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await service.findAll(mockAdminRequest, 1, 10);

      expect(result).toEqual(mockUsers);
      expect(mockQueryBuilder.select).not.toHaveBeenCalled();
    });

    it('should handle pagination correctly', async () => {
      jest.spyOn(userProvider, 'userStatus').mockReturnValue(AccessLevel.ADMIN);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockUsers, 1]);

      await service.findAll(mockAdminRequest, 2, 5);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5); // (2-1) * 5
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
    });

    it('should throw NotFoundException when no users found', async () => {
      jest.spyOn(userProvider, 'userStatus').mockReturnValue(AccessLevel.ADMIN);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await expect(service.findAll(mockAdminRequest, 1, 10)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete user when user has permission', async () => {
      const expectedMessage = { message: 'User deleted successfully' };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userProvider, 'hasPermission').mockReturnValue(true);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(mockUser);
      jest.spyOn(userProvider, 'outMessage').mockReturnValue(expectedMessage);

      const result = await service.delete('testuser', mockUserRequest);

      expect(result).toEqual(expectedMessage);
      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
      expect(userProvider.outMessage).toHaveBeenCalledWith(UserProps.delete, {
        name: 'testuser',
        uuid: mockUser.user_uuid,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.delete('nonexistent', mockUserRequest),
      ).rejects.toThrow(NotFoundException);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        name: 'nonexistent',
      });
    });

    it('should throw UnauthorizedException when user has no permission', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userProvider, 'hasPermission').mockReturnValue(false);

      await expect(service.delete('testuser', mockUserRequest)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(userRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDTO: UpdateUserDTO = {
      name: 'newname',
      pass: 'newpassword',
    };

    it('should update user successfully', async () => {
      const changes = [
        { prop: 'name', from: 'testuser', to: 'newname' },
        { prop: 'pass', from: 'hashedpassword', to: 'newhashedpassword' },
      ];
      const alterOrigin = { name: 'newname', pass: 'newpassword' };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userProvider, 'hasPermission').mockReturnValue(true);
      jest
        .spyOn(globalProvider, 'updateAssign')
        .mockReturnValue({ changes, alterOrigin });
      jest
        .spyOn(userProvider, 'passHash')
        .mockResolvedValue('newhashedpassword');
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.update(
        updateDTO,
        'testuser',
        mockUserRequest,
      );

      expect(result).toContain('User testuser updated.');
      expect(result).toContain('Changes:');
      expect(userProvider.passHash).toHaveBeenCalledWith('newpassword');
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.update(updateDTO, 'testuser', mockUserRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user has no permission', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userProvider, 'hasPermission').mockReturnValue(false);

      await expect(
        service.update(updateDTO, 'testuser', mockUserRequest),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should handle random password generation', async () => {
      const updateDTOWithRandomPass: UpdateUserDTO = {
        random_pass: true,
        weights: [0.5, 0.3, 0.2],
      };

      const alterOrigin = {};

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userProvider, 'hasPermission').mockReturnValue(true);
      jest
        .spyOn(globalProvider, 'updateAssign')
        .mockReturnValue({ changes: [], alterOrigin });
      jest
        .spyOn(userProvider, 'genRandomNormalizedWeights')
        .mockReturnValue([0.4, 0.3, 0.3]);
      jest
        .spyOn(userProvider, 'genRandomString')
        .mockReturnValue('randompass123');
      jest
        .spyOn(userProvider, 'passHash')
        .mockResolvedValue('hashedrandompass');
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.update(
        updateDTOWithRandomPass,
        'testuser',
        mockUserRequest,
      );

      expect(userProvider.genRandomString).toHaveBeenCalledWith(
        12,
        [0.4, 0.3, 0.3],
      );
      expect(result).toContain('No changes were made.');
    });

    it('should handle random password without weights', async () => {
      const updateDTOWithRandomPass: UpdateUserDTO = {
        random_pass: true,
      };

      const alterOrigin = {};

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userProvider, 'hasPermission').mockReturnValue(true);
      jest
        .spyOn(globalProvider, 'updateAssign')
        .mockReturnValue({ changes: [], alterOrigin });
      jest
        .spyOn(userProvider, 'genRandomString')
        .mockReturnValue('randompass123');
      jest
        .spyOn(userProvider, 'passHash')
        .mockResolvedValue('hashedrandompass');
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      await service.update(
        updateDTOWithRandomPass,
        'testuser',
        mockUserRequest,
      );

      expect(userProvider.genRandomString).toHaveBeenCalledWith(12);
    });

    it('should not save when no changes are made', async () => {
      const alterOrigin = {};

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userProvider, 'hasPermission').mockReturnValue(true);
      jest
        .spyOn(globalProvider, 'updateAssign')
        .mockReturnValue({ changes: [], alterOrigin });
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.update({}, 'testuser', mockUserRequest);

      expect(userRepository.save).not.toHaveBeenCalled();
      expect(result).toContain('No changes were made.');
    });
  });
});
