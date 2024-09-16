import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Batida } from '../batidas/entities/batida.entity';
import { ReportUseCase } from './report.usecase';

const batidaRepositoryMock = {
  findByMonth: jest.fn(),
};

describe('ReportUseCase', () => {
  let sut: ReportUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportUseCase,
        {
          provide: 'BatidaRepositoryInterface',
          useValue: batidaRepositoryMock,
        },
      ],
    }).compile();

    sut = module.get<ReportUseCase>(ReportUseCase);

    jest.clearAllMocks();
  });

  it('should throw NotFoundException if no data is found for the given month', async () => {
    batidaRepositoryMock.findByMonth.mockResolvedValue([]);

    await expect(sut.execute('2024-09')).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if there is an invalid number of points for a day', async () => {
    const batidas: Batida[] = [
      { id: 1, date: '2024-09-15', time: '08:00:00' },
      { id: 2, date: '2024-09-15', time: '12:00:00' },
      { id: 3, date: '2024-09-15', time: '13:00:00' },
    ];

    batidaRepositoryMock.findByMonth.mockResolvedValue(batidas);

    await expect(sut.execute('2024-09')).rejects.toThrow(BadRequestException);
  });

  it('should calculate hours worked, with no excess hours and no hours owed', async () => {
    const batidas: Batida[] = [
      { id: 1, date: '2024-09-15', time: '08:00:00' },
      { id: 2, date: '2024-09-15', time: '12:00:00' },
      { id: 3, date: '2024-09-15', time: '13:00:00' },
      { id: 4, date: '2024-09-15', time: '17:00:00' },
    ];

    batidaRepositoryMock.findByMonth.mockResolvedValue(batidas);

    const result = await sut.execute('2024-09');

    expect(result.horasTrabalhadas).toEqual('PT8H');
    expect(result.horasExcedentes).toEqual('PT0S');
    expect(result.horasDevidas).toEqual('PT0S');
  });

  it('should calculate hours worked, with excess hours and no hours owed', async () => {
    const batidas: Batida[] = [
      { id: 1, date: '2024-09-15', time: '08:00:00' },
      { id: 2, date: '2024-09-15', time: '12:00:00' },
      { id: 3, date: '2024-09-15', time: '13:00:00' },
      { id: 4, date: '2024-09-15', time: '18:00:00' },
    ];

    batidaRepositoryMock.findByMonth.mockResolvedValue(batidas);

    const result = await sut.execute('2024-09');

    expect(result.horasTrabalhadas).toEqual('PT9H');
    expect(result.horasExcedentes).toEqual('PT1H');
    expect(result.horasDevidas).toEqual('PT0S');
  });

  it('should calculate hours worked, with no excess hours and hours owed', async () => {
    const batidas: Batida[] = [
      { id: 1, date: '2024-09-15', time: '08:00:00' },
      { id: 2, date: '2024-09-15', time: '12:00:00' },
      { id: 3, date: '2024-09-15', time: '13:00:00' },
      { id: 4, date: '2024-09-15', time: '16:00:00' },
    ];

    batidaRepositoryMock.findByMonth.mockResolvedValue(batidas);

    const result = await sut.execute('2024-09');

    expect(result.horasTrabalhadas).toEqual('PT7H');
    expect(result.horasExcedentes).toEqual('PT0S');
    expect(result.horasDevidas).toEqual('PT1H');
  });

  it('should return a valid report for the given month', async () => {
    const batidas: Batida[] = [
      { id: 1, date: '2024-09-15', time: '08:00:00' },
      { id: 2, date: '2024-09-15', time: '12:00:00' },
      { id: 3, date: '2024-09-15', time: '13:00:00' },
      { id: 4, date: '2024-09-15', time: '18:30:30' },
    ];

    batidaRepositoryMock.findByMonth.mockResolvedValue(batidas);

    const result = await sut.execute('2024-09');

    expect(result.anoMes).toEqual('2024-09');
    expect(result.horasTrabalhadas).toEqual('PT9H30M30S');
    expect(result.horasExcedentes).toEqual('PT1H30M30S');
    expect(result.horasDevidas).toEqual('PT0S');
    expect(result.expedientes).toEqual([
      {
        dia: '2024-09-15',
        pontos: ['08:00:00', '12:00:00', '13:00:00', '18:30:30'],
      },
    ]);
  });
});
