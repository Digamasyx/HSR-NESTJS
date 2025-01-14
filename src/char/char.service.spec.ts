import { CharService } from './char.service';
import { Char } from './entity/char.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { CharProvider } from './char.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CharDTO, UpdateCharDTO } from './dto/char.dto';
import { Paths, Types } from './enums/char.enum';
import { BadRequestException } from '@nestjs/common';
import { LevelRange } from './types/char.types';

describe('CharService', () => {
  let service: CharService;

  const mockCharRepo = {
    create: jest.fn(),
    insert: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
  };

  const createTestingModule = async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharService,
        CharProvider,
        {
          provide: getRepositoryToken(Char),
          useValue: mockCharRepo,
        },
      ],
    }).compile();

    service = module.get<CharService>(CharService);
  };

  beforeEach(async () => {
    await createTestingModule();
  });

  describe.each([
    { level: '10/80', expectedAsc: 0 },
    { level: '25/80', expectedAsc: 1 },
    { level: '35/80', expectedAsc: 2 },
    { level: '45/80', expectedAsc: 3 },
    { level: '55/80', expectedAsc: 4 },
    { level: '65/80', expectedAsc: 5 },
    { level: '75/80', expectedAsc: 6 },
  ])('create (Positive case with different levels)', ({ level }) => {
    it(`should create a char successfully with level ${level}`, async () => {
      const lv = level as LevelRange;
      const charDTO: CharDTO = {
        name: 'Lorem',
        level: lv,
        atk: [{ level: 10, value: 100 }],
        def: [{ level: 10, value: 100 }],
        hp: [{ level: 0, value: 500 }],
        spd: 100,
        path: Paths.Harmony,
        type: Types.Fire,
      };

      mockCharRepo.create.mockReturnValue(charDTO);
      mockCharRepo.insert.mockResolvedValue(undefined);

      const result = await service.create(charDTO);
      expect(result.message).toEqual(
        `Char with name: ${charDTO.name} was created.`,
      );
      expect(mockCharRepo.create).toHaveBeenCalledWith(charDTO);
      expect(mockCharRepo.insert).toHaveBeenCalledWith(charDTO);
    });
  });
  describe('create (Positive cases)', () => {
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
    it('should create a Char successfully w/o asc', async () => {
      mockCharRepo.create.mockReturnValue(charDTO);
      mockCharRepo.insert.mockResolvedValue(undefined);

      const result = await service.create(charDTO);
      expect(result.message).toEqual(
        `Char with name: ${charDTO.name} was created.`,
      );
      expect(mockCharRepo.create).toHaveBeenCalledWith(charDTO);
      expect(mockCharRepo.insert).toHaveBeenCalledWith(charDTO);
    });
    it('should create a Char successfully with asc', async () => {
      charDTO.asc = 1;

      mockCharRepo.create.mockReturnValue(charDTO);
      mockCharRepo.insert.mockResolvedValue(undefined);

      const result = await service.create(charDTO);
      expect(result.message).toEqual(
        `Char with name: ${charDTO.name} was created.`,
      );
      expect(mockCharRepo.create).toHaveBeenCalledWith(charDTO);
      expect(mockCharRepo.insert).toHaveBeenCalledWith(charDTO);
    });
  });

  describe('create (Negative cases)', () => {
    const charDTO: CharDTO = {
      name: 'DuplicateChar',
      level: '10/80',
      atk: [{ level: 10, value: 100 }],
      def: [{ level: 10, value: 50 }],
      hp: [{ level: 10, value: 500 }],
      spd: 10,
      path: Paths.Harmony,
      type: Types.Fire,
    };
    it('should throw an error if name already exists', async () => {
      mockCharRepo.findOneBy.mockResolvedValue(charDTO);

      await expect(service.create(charDTO)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockCharRepo.findOneBy).toHaveBeenCalledWith({
        name: charDTO.name,
      });
    });
    it('should throw an error if level is less than 1', async () => {
      delete charDTO.asc;
      // @ts-expect-error: Test case
      charDTO.level = '-1/80';

      await expect(service.create(charDTO)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should throw an error if level is greater than 80', async () => {
      delete charDTO.asc;
      // @ts-expect-error: Test case
      charDTO.level = '81/80';

      await expect(service.create(charDTO)).rejects.toThrow(
        new BadRequestException(
          `Non valid level inserted. Expected: 1 to 80 | Received: ${81}`,
        ),
      );
    });
  });

  describe('find (Positive case)', () => {
    it('should find a Char successfully', async () => {
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

      mockCharRepo.findOneBy.mockResolvedValue(charDTO);

      const result = await service.find(charDTO.name);
      expect(result).toEqual(charDTO);
      expect(mockCharRepo.findOneBy).toHaveBeenCalledWith({
        name: charDTO.name,
      });
    });
  });

  describe('find (Negative cases)', () => {
    it('should throw and error if Char does not exists', async () => {
      mockCharRepo.findOneBy.mockResolvedValue(null);
      await expect(service.find('Lorem')).rejects.toThrow(BadRequestException);
    });
    it('should throw an error if name is empty', async () => {
      await expect(service.find('')).rejects.toThrow(BadRequestException);
    });
  });
  describe('find (Edge case)', () => {
    it('should find a char with special characters in the name', async () => {
      const charDTO: CharDTO = {
        name: 'Special@Char#Name!',
        level: '10/80',
        atk: [{ level: 10, value: 100 }],
        def: [{ level: 10, value: 50 }],
        hp: [{ level: 10, value: 500 }],
        spd: 10,
        path: Paths.Harmony,
        type: Types.Fire,
      };
      mockCharRepo.findOneBy.mockResolvedValue(charDTO as any);
      const result = await service.find('Special@Char#Name!');
      expect(result).toEqual(charDTO);
      expect(mockCharRepo.findOneBy).toHaveBeenCalledWith({
        name: charDTO.name,
      });
    });
  });

  describe('remove (Positive case)', () => {
    it('should remove a char', async () => {
      const char = new Char();
      char.name = 'Lorem';

      mockCharRepo.findOneBy.mockResolvedValue(char);
      mockCharRepo.remove.mockResolvedValue(char);

      const result = await service.remove(char.name);

      expect(result.message).toBe(
        `The char with name: ${char.name} was removed.`,
      );
      expect(mockCharRepo.findOneBy).toHaveBeenCalledWith({ name: char.name });
      expect(mockCharRepo.remove).toHaveBeenCalledWith(char);
    });
  });

  describe('remove (Negative case)', () => {
    it('should return an error if char does not exists', async () => {
      const char = new Char();
      char.name = 'Lorem';

      mockCharRepo.findOneBy.mockResolvedValue(null);

      expect(service.remove(char.name)).rejects.toThrow(BadRequestException);
      expect(mockCharRepo.findOneBy).toHaveBeenCalledWith({ name: char.name });
    });
  });

  describe('update (Positive case)', () => {
    it('should update a char field', async () => {
      const char = {
        name: 'Lorem',
        atk: '[{ "level":1,"value":10 }]',
        def: '[{ "level":1,"value":10 }]',
        hp: '[{ "level":1,"value":10 }]',
      };
      mockCharRepo.findOneBy.mockResolvedValue(char);

      const updateChar: UpdateCharDTO = {
        atk: [{ level: 1, value: 20 }],
      };
      const expectedChar = {
        ...char,
        atk: '[{"level":1,"value":20}]',
      };
      await service.update(updateChar, 'Lorem');

      expect(mockCharRepo.save).toHaveBeenCalledWith(expectedChar);
    });
  });
  describe('update (Negative case)', () => {
    it('should throw a error if char does not exists', async () => {
      mockCharRepo.findOneBy.mockResolvedValue(null);

      expect(service.update({}, 'Lorem')).rejects.toThrow(BadRequestException);
    });
  });
  describe('update (Edge case)', () => {
    it('should throw an error if 0 arguments were present in body', async () => {
      mockCharRepo.findOneBy.mockResolvedValue({ name: 'Lorem' });

      expect(service.update({} as any, 'Lorem')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
