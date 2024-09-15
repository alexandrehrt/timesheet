import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateBatidaUseCase } from './create-batida.usecase';
import { CreateBatidaDto } from './dto/create-batida.dto';

const batidaRepositoryMock = {
  findByDate: jest.fn(),
  create: jest.fn(),
};

const dateFactory = (time = '08:00:00', weekend = false) => {
  return weekend ? `2024-09-14T${time}` : `2024-09-18T${time}`;
};

describe('CreateBatidaUseCase', () => {
  let sut: CreateBatidaUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBatidaUseCase,
        {
          provide: 'BatidaRepositoryInterface',
          useValue: batidaRepositoryMock,
        },
      ],
    }).compile();

    sut = module.get<CreateBatidaUseCase>(CreateBatidaUseCase);

    jest.clearAllMocks();
  });

  it('should not be able to register a time on weekend', async () => {
    const dto: CreateBatidaDto = { momento: dateFactory('', true) };
    batidaRepositoryMock.findByDate.mockResolvedValue([]);

    await expect(sut.execute(dto)).rejects.toThrow(
      new BadRequestException(
        'Sábado e domingo não são permitidos como dia de trabalho',
      ),
    );
  });

  it('should not be able to register more than 4 times in a day', async () => {
    const dto: CreateBatidaDto = { momento: dateFactory() };
    batidaRepositoryMock.findByDate.mockResolvedValue([
      { time: '08:00:00' },
      { time: '12:00:00' },
      { time: '13:00:00' },
      { time: '18:00:00' },
    ]);

    await expect(sut.execute(dto)).rejects.toThrow(
      new BadRequestException(
        'Apenas 4 horários podem ser registrados por dia',
      ),
    );
  });

  it('should not be able to register a time that has already been registered', async () => {
    const dto: CreateBatidaDto = { momento: dateFactory() };
    batidaRepositoryMock.findByDate.mockResolvedValue([{ time: '08:00:00' }]);

    await expect(sut.execute(dto)).rejects.toThrow(
      new ConflictException('Horário já registrado'),
    );
  });

  it('should not be able to register a time with less than 1 hour of break', async () => {
    const dto: CreateBatidaDto = { momento: dateFactory('13:00:00') };
    batidaRepositoryMock.findByDate.mockResolvedValue([
      { time: '08:00:00' },
      { time: '12:30:00' },
    ]);

    await expect(sut.execute(dto)).rejects.toThrow(
      new BadRequestException('Deve haver no mínimo 1 hora de almoço'),
    );
  });

  it('should register a time and return the times of the day', async () => {
    const dto: CreateBatidaDto = { momento: dateFactory() };
    batidaRepositoryMock.findByDate.mockResolvedValue([]);
    batidaRepositoryMock.create.mockResolvedValue([
      { date: '2024-09-18', time: '08:00:00' },
    ]);

    const result = await sut.execute(dto);

    expect(result).toEqual({
      dia: '2024-09-18',
      pontos: ['08:00:00'],
    });
  });
});
