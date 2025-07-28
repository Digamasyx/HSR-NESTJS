import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthGuard } from '@auth/auth.guard';
import { RolesGuard } from '@roles/roles.guard';
import { GlobalExceptionFilter } from '@globals/filter/globalException.filter';
import { UserDTO, UpdateUserDTO } from './dto/user.dto';
import { User } from './entity/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  /* ---------- Mocks ---------- */
  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<UserService>;

  const allowGuard = { canActivate: () => true };

  const mockExceptionFilter = { catch: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      /* ------------- Guards --------------- */
      .overrideGuard(AuthGuard)
      .useValue(allowGuard)
      .overrideGuard(RolesGuard)
      .useValue(allowGuard)
      /* --------- Exception Filter --------- */
      .overrideFilter(GlobalExceptionFilter)
      .useValue(mockExceptionFilter)
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  /* -------------------------------------- */
  /* create()                               */
  /* -------------------------------------- */
  it('should delegate to userService.create()', async () => {
    const dto: UserDTO = { name: 'john', pass: '123' };
    const req: any = { login_status: false };
    mockUserService.create.mockResolvedValue({ message: 'ok' });

    const result = await controller.create(dto, req);

    expect(service.create).toHaveBeenCalledWith(dto, req);
    expect(result).toEqual({ message: 'ok' });
  });

  /* -------------------------------------- */
  /* findAll()                              */
  /* -------------------------------------- */
  it('should delegate to userService.findAll() with default values', async () => {
    const req: any = { login_status: false };
    const users = [{ name: 'john' }];
    mockUserService.findAll.mockResolvedValue(users as User[]);

    const result = await controller.findAll(
      req,
      undefined as any,
      undefined as any,
    );

    expect(service.findAll).toHaveBeenCalledWith(req, 1, 10);
    expect(result).toBe(users);
  });

  it('should forward the page and limit informed', async () => {
    const req: any = { login_status: false };
    mockUserService.findAll.mockResolvedValue([]);

    await controller.findAll(req, 3, 5);

    expect(service.findAll).toHaveBeenCalledWith(req, 3, 5);
  });

  /* -------------------------------------- */
  /* find()                                 */
  /* -------------------------------------- */
  it('should delegate to userService.find()', async () => {
    const req: any = { login_status: true };
    const user = { name: 'john' };
    mockUserService.find.mockResolvedValue(user as User);

    const result = await controller.find('john', req);

    expect(service.find).toHaveBeenCalledWith('john', req);
    expect(result).toBe(user);
  });

  /* -------------------------------------- */
  /* delete()                               */
  /* -------------------------------------- */
  it('should delegate to userService.delete()', async () => {
    const req: any = { login_status: true };
    mockUserService.delete.mockResolvedValue({ message: 'deleted' });

    const result = await controller.delete('john', req);

    expect(service.delete).toHaveBeenCalledWith('john', req);
    expect(result).toEqual({ message: 'deleted' });
  });

  /* -------------------------------------- */
  /* update()                               */
  /* -------------------------------------- */
  it('should delegate to userService.update()', async () => {
    const req: any = { login_status: true };
    const body: UpdateUserDTO = { pass: '321' };
    mockUserService.update.mockResolvedValue('updated');

    const result = await controller.update(body, 'john', req);

    expect(service.update).toHaveBeenCalledWith(body, 'john', req);
    expect(result).toBe('updated');
  });
});
