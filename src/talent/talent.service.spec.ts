import { Repository } from 'typeorm';
import { TalentService } from './talent.service';
import { Talent } from './entity/talent.entity';
import { Char } from 'src/char/entity/char.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TalentDTO } from './dto/talent.dto';
import { Effect } from './enums/talent.enum';
import { BadRequestException } from '@nestjs/common';

describe('TalentService', () => {
  let service: TalentService;
  let talentRepo: jest.Mocked<Repository<Talent>>;
  let charRepo: jest.Mocked<Repository<Char>>;

  const mockTalentRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    remove: jest.fn(),
  };

  const mockCharRepo = {
    findOneBy: jest.fn(),
  };

  const createTestingModule = async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TalentService,
        {
          provide: getRepositoryToken(Talent),
          useValue: mockTalentRepo,
        },
        {
          provide: getRepositoryToken(Char),
          useValue: mockCharRepo,
        },
      ],
    }).compile();

    service = module.get<TalentService>(TalentService);
    talentRepo = module.get(getRepositoryToken(Talent));
    charRepo = module.get(getRepositoryToken(Char));
  };

  beforeEach(async () => {
    await createTestingModule();
  });

  describe('create (Positive Case)', () => {
    const body: TalentDTO = {
      effect: Effect.Buff,
      stat: 'atk',
      value: 12,
      multiplicative: true,
    };
    const charName = 'Yunli';
    it('should create a talent', async () => {
      const char = new Char();
      char.name = charName;

      charRepo.findOneBy.mockResolvedValue(char);
      talentRepo.create.mockReturnValue(new Talent());
      talentRepo.save.mockResolvedValue(undefined);

      const result = await service.create(body, charName);

      expect(result).toEqual({
        message: `Talent for 'char': ${charName}, was created.`,
      });
      expect(charRepo.findOneBy).toHaveBeenCalledWith({ name: charName });
      expect(talentRepo.create).toHaveBeenCalledWith(body);
      expect(talentRepo.save).toHaveBeenCalled();
    });
  });
  describe('create (Negative Cases)', () => {
    const body: TalentDTO = {
      effect: Effect.Buff,
      stat: 'atk',
      value: 12,
      multiplicative: true,
    };
    const charName = 'lorem';
    it('should throw an error if character not found', async () => {
      charRepo.findOneBy.mockResolvedValue(null);
      await expect(service.create(body, charName)).rejects.toThrow(
        BadRequestException,
      );
      expect(charRepo.findOneBy).toHaveBeenCalledWith({ name: charName });
    });
  });

  describe('find (Positive Cases)', () => {
    it('should find a talent by ID', async () => {
      const talentId = 1;
      const expectedTalent = new Talent();
      expectedTalent.talent_id = talentId;

      talentRepo.findOneBy.mockResolvedValue(expectedTalent);

      const result = await service.find(talentId);
      expect(result).toEqual(expectedTalent);
      expect(talentRepo.findOneBy).toHaveBeenCalledWith({
        talent_id: talentId,
      });
    });
    it('should find talents by a charName', async () => {
      const charName = 'Yunli';
      const expectedTalent = [new Talent()];

      talentRepo.findBy.mockResolvedValue(expectedTalent);

      const result = await service.find(charName);
      expect(result).toEqual(expectedTalent);
      expect(talentRepo.findBy).toHaveBeenCalledWith({
        char: { name: charName },
      });
    });
  });
  describe('find (Negative Cases)', () => {
    it('should throw an error if no talent is found by ID', async () => {
      const talentId = 1;

      talentRepo.findOneBy.mockResolvedValue(null);

      await expect(service.find(talentId)).rejects.toThrow(
        new BadRequestException(
          `Talent with specified Id: ${talentId} was not found.`,
        ),
      );
    });
    it('should throw an error if no talent is foun by charName', async () => {
      const charName = 'Yunli';

      talentRepo.findBy.mockResolvedValue(null);

      await expect(service.find(charName)).rejects.toThrow(
        new BadRequestException(
          `Talent with associated Char: ${charName} was not found.`,
        ),
      );
    });
  });
  describe('find (Edge Cases)', () => {
    it('should throw an error if an empty charName is passed', async () => {
      const emptyName = '';

      talentRepo.findBy.mockResolvedValue(null);

      await expect(service.find(emptyName)).rejects.toThrow(
        new BadRequestException('Empty char name was inserted.'),
      );
    });
    it('should throw an error if a negative number is passed as ID', async () => {
      const negativeId = -1;

      talentRepo.findOneBy.mockResolvedValue(null);

      await expect(service.find(negativeId)).rejects.toThrow(
        new BadRequestException('Only positive ID values can be inserted.'),
      );
    });
  });
});
