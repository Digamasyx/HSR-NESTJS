import { Test, TestingModule } from '@nestjs/testing';
import { CharController } from './char.controller';
import { CharService } from './char.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Char } from './entity/char.entity';
import { CharDTO, UpdateCharDTO } from './dto/char.dto';
import { Paths, Types } from './enums/char.enum';
import { User } from 'src/user/entity/user.entity';
import { DataSource } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthModule } from 'src/auth/auth.module';
import { MAGIC_WORDS } from 'src/database/constants';
import { Talent } from 'src/talent/entity/talent.entity';

jest.mock('./char.service');

describe('CharController', () => {
  let controller: CharController;
  let service: CharService;
  let module: TestingModule;

  const mockCharRepo = {
    create: jest.fn(),
    insert: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
  };

  const mockDataSource = {
    manager: {
      getRepository: jest.fn().mockReturnValue(mockCharRepo),
    },
  };

  const createTestingModule = async () => {
    module = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forFeature([Char, User, Talent]),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: MAGIC_WORDS.HOST,
          port: MAGIC_WORDS.PORT,
          username: MAGIC_WORDS.USERNAME,
          password: MAGIC_WORDS.PASSWORD,
          database: 'hsr_test',
          entities: [Char, User, Talent],
          synchronize: true,
        }),
      ],
      controllers: [CharController],
      providers: [
        CharService,
        {
          provide: 'AUTH_GUARD',
          useClass: AuthGuard,
        },
        {
          provide: 'ROLES_GUARD',
          useClass: RolesGuard,
        },
        {
          provide: getRepositoryToken(Char),
          useValue: mockCharRepo,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    controller = module.get<CharController>(CharController);
    service = module.get<CharService>(CharService);
  };

  beforeEach(async () => {
    await createTestingModule();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a char', async () => {
    const charDTO: CharDTO = {
      name: 'Lorem',
      level: '10/80',
      atk: [{ level: 10, value: 100 }],
      def: [{ level: 10, value: 100 }],
      hp: [{ level: 0, value: 500 }],
      spd: 100,
      path: Paths.Harmony,
      type: Types.Fire,
    };

    const result = { message: `Char with name: ${charDTO.name} was created.` };
    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(charDTO)).toBe(result);
  });

  it('should find a char by name', async () => {
    const charDTO: CharDTO = {
      name: 'ExistingChar',
      level: '10/80',
      atk: [{ level: 10, value: 100 }],
      def: [{ level: 10, value: 50 }],
      hp: [{ level: 10, value: 500 }],
      spd: 10,
      path: Paths.Harmony,
      type: Types.Fire,
    };

    jest.spyOn(service, 'find').mockResolvedValue(charDTO as any);

    expect(await controller.find('ExistingChar')).toBe(charDTO);
  });
  it('should remove a char', async () => {
    const charDTO = {
      name: 'RemovedChar',
    };

    jest.spyOn(service, 'remove').mockResolvedValue({
      message: `The char with name: ${charDTO.name} was removed.`,
    });

    expect((await controller.remove('RemovedChar')).message).toBe(
      `The char with name: ${charDTO.name} was removed.`,
    );
  });
  it('should update a char', async () => {
    const updateDTO: UpdateCharDTO = {
      name: 'Ipsum',
    };

    jest.spyOn(service, 'update').mockResolvedValue(void 0);

    expect(await controller.update(updateDTO, 'Lorem')).toBe<void>;
  });
});
