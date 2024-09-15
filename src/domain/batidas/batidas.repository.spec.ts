import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BatidaRepository } from './batidas.repository';
import { Batida } from './entities/batida.entity';

describe('BatidaRepository', () => {
  let repository: BatidaRepository;
  let mockRepository: Partial<Repository<Batida>>;

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatidaRepository,
        {
          provide: getRepositoryToken(Batida),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<BatidaRepository>(BatidaRepository);
  });

  it('should create an entry and return all the day entries', async () => {
    const date = '2024-09-15';
    const time = '08:00:00';
    const batida = new Batida();
    batida.date = date;
    batida.time = time;

    (mockRepository.save as jest.Mock).mockResolvedValueOnce(batida);

    (mockRepository.find as jest.Mock).mockResolvedValueOnce([batida]);

    const result = await repository.create({ date, time });

    expect(result).toEqual([batida]);
    expect(mockRepository.save).toHaveBeenCalledWith(batida);
    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { date },
      order: { time: 'ASC' },
    });
  });

  it('should return all the day entries', async () => {
    const date = '2024-09-15';
    const batida = new Batida();
    batida.date = date;
    batida.time = '08:00:00';

    (mockRepository.find as jest.Mock).mockResolvedValueOnce([batida]);

    const result = await repository.findByDate(date);

    expect(result).toEqual([batida]);
    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { date },
      order: { time: 'ASC' },
    });
  });
});
