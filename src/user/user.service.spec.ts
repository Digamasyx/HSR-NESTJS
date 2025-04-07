import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserProvider } from './user.provider';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UserDTO, UpdateUserDTO } from './dto/user.dto';
import { CustomRequest } from '@globals/interface/global.interface';

describe('UserService', () => {
  let service: UserService;
  let userRepo: Repository<User>;
  let userProvider: UserProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserProvider,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    userProvider = module.get<UserProvider>(UserProvider);
  });

  describe('create', () => {
    it('should throw BadRequestException if user is logged in', async () => {
      const req: CustomRequest = { login_status: true } as CustomRequest;
      const body: UserDTO = { name: 'test', pass: 'test' } as UserDTO;

      await expect(service.create(body, req)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a user with a random password if pass is not provided', async () => {
      const req: CustomRequest = { login_status: false } as CustomRequest;
      const body: UserDTO = { name: 'test' } as UserDTO;
      const hashedPass = 'hashedPass';
      const randomPass = 'randomPass';

      // @ts-expect-error: testing
      jest.spyOn(userProvider, 'genRandomString').mockReturnValue(randomPass);
      jest.spyOn(userProvider, 'passHash').mockResolvedValue(hashedPass);
      jest.spyOn(userRepo, 'create').mockReturnValue(body as any);
      jest.spyOn(userRepo, 'insert').mockResolvedValue(undefined);
      // @ts-expect-error: testing
      jest.spyOn(userProvider, 'outMessage').mockReturnValue('message');

      const result = await service.create(body, req);

      expect(userProvider.genRandomString).toHaveBeenCalledWith(
        12,
        [0.7, 0.2, 0.1],
      );
      expect(userProvider.passHash).toHaveBeenCalledWith(randomPass);
      expect(userRepo.create).toHaveBeenCalledWith(body);
      expect(userRepo.insert).toHaveBeenCalledWith(body);
      expect(result).toBe('message');
    });

    it('should create a user with provided password', async () => {
      const req: CustomRequest = { login_status: false } as CustomRequest;
      const body: UserDTO = { name: 'test', pass: 'test' } as UserDTO;
      const hashedPass = 'hashedPass';

      jest.spyOn(userProvider, 'passHash').mockResolvedValue(hashedPass);
      jest.spyOn(userRepo, 'create').mockReturnValue(body as any);
      jest.spyOn(userRepo, 'insert').mockResolvedValue(undefined);

      const result = await service.create(body, req);

      expect(userProvider.passHash).toHaveBeenCalledWith('test');
      expect(userRepo.create).toHaveBeenCalledWith(body);
      expect(userRepo.insert).toHaveBeenCalledWith(body);
      expect(result).toBe(undefined);
    });
  });

  describe('find', () => {
    it('should return user if found and user status is not_logged or User', async () => {
      const req: CustomRequest = { login_status: false } as CustomRequest;
      const name = 'test';
      const user = { name: 'test', created_at: new Date() } as User;

      jest.spyOn(userProvider, 'userStatus').mockReturnValue('not_logged');
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);

      const result = await service.find(name, req);

      expect(userProvider.userStatus).toHaveBeenCalledWith(req);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { name },
        select: { name: true, created_at: true },
      });
      expect(result).toBe(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const req: CustomRequest = { login_status: false } as CustomRequest;
      const name = 'test';

      jest.spyOn(userProvider, 'userStatus').mockReturnValue('not_logged');
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      await expect(service.find(name, req)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all users if user status is not_logged or User', async () => {
      const req: CustomRequest = { login_status: false } as CustomRequest;
      const users = [{ name: 'test', created_at: new Date() }] as User[];

      jest.spyOn(userProvider, 'userStatus').mockReturnValue('not_logged');
      jest.spyOn(userRepo, 'find').mockResolvedValue(users);

      const result = await service.findAll(req);

      expect(userProvider.userStatus).toHaveBeenCalledWith(req);
      expect(userRepo.find).toHaveBeenCalledWith({
        select: { name: true, created_at: true },
      });
      expect(result).toBe(users);
    });

    it('should throw NotFoundException if no users are found', async () => {
      const req: CustomRequest = { login_status: false } as CustomRequest;

      jest.spyOn(userProvider, 'userStatus').mockReturnValue('not_logged');
      jest.spyOn(userRepo, 'find').mockResolvedValue([]);

      await expect(service.findAll(req)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const req: CustomRequest = {} as CustomRequest;
      const name = 'test';

      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      await expect(service.delete(name, req)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if user does not have permission', async () => {
      const req: CustomRequest = {} as CustomRequest;
      const name = 'test';
      const user = { name: 'test', user_uuid: 'uuid' } as User;

      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(userProvider, 'hasPermission').mockReturnValue(false);

      await expect(service.delete(name, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should delete user if user has permission', async () => {
      const req: CustomRequest = {} as CustomRequest;
      const name = 'test';
      const user = { name: 'test', user_uuid: 'uuid' } as User;

      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(userProvider, 'hasPermission').mockReturnValue(true);
      jest.spyOn(userRepo, 'remove').mockResolvedValue(undefined);
      // @ts-expect-error: testing
      jest.spyOn(userProvider, 'outMessage').mockReturnValue('message');

      const result = await service.delete(name, req);

      expect(userRepo.findOneBy).toHaveBeenCalledWith({ name });
      expect(userProvider.hasPermission).toHaveBeenCalledWith(user, req);
      expect(userRepo.remove).toHaveBeenCalledWith(user);
      expect(result).toBe('message');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const req: CustomRequest = {} as CustomRequest;
      const name = 'test';
      const body: UpdateUserDTO = { name: 'newName' } as UpdateUserDTO;

      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(body, name, req)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not have permission', async () => {
      const req: CustomRequest = {} as CustomRequest;
      const name = 'test';
      const body: UpdateUserDTO = { name: 'newName' } as UpdateUserDTO;
      const user = { name: 'test' } as User;

      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(userProvider, 'hasPermission').mockReturnValue(false);

      await expect(service.update(body, name, req)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should update user with provided properties', async () => {
      const req: CustomRequest = {} as CustomRequest;
      const name = 'test';
      const body: UpdateUserDTO = { name: 'newName' } as UpdateUserDTO;
      const user = { name: 'test' } as User;
      const updatedUser = { name: 'newName' } as User;
      const properties = { name: 'newName' };
      const pass = 'newPass';

      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(userProvider, 'hasPermission').mockReturnValue(true);
      // @ts-expect-error: testing
      jest.spyOn(userProvider, 'nonNullProperties').mockReturnValue(properties);
      jest
        .spyOn(userProvider, 'changeProperties')
        .mockResolvedValue([updatedUser, pass]);
      jest.spyOn(userRepo, 'save').mockResolvedValue(updatedUser);
      // @ts-expect-error: testing
      jest.spyOn(userProvider, 'outMessage').mockReturnValue('message');

      const result = await service.update(body, name, req);

      expect(userRepo.findOneBy).toHaveBeenCalledWith({ name });
      expect(userProvider.hasPermission).toHaveBeenCalledWith(user, req);
      expect(userProvider.nonNullProperties).toHaveBeenCalledWith(body);
      expect(userProvider.changeProperties).toHaveBeenCalledWith(
        properties,
        user,
        body,
        body.random_pass,
      );
      expect(userRepo.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toBe('message');
    });
  });
});
