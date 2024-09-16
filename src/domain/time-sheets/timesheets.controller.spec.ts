import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReportDto } from './dto/report.dto';
import { ReportUseCase } from './report.usecase';
import { TimeSheetsController } from './timesheets.controller';

describe('TimesheetsController', () => {
  let timeSheetsController: TimeSheetsController;
  let reportUseCase: ReportUseCase;

  const mockReportUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeSheetsController],
      providers: [
        {
          provide: ReportUseCase,
          useValue: mockReportUseCase,
        },
      ],
    }).compile();

    timeSheetsController =
      module.get<TimeSheetsController>(TimeSheetsController);
    reportUseCase = module.get<ReportUseCase>(ReportUseCase);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a timesheet for the given month', async () => {
    const mockReport: ReportDto = {
      anoMes: '2024-09',
      horasTrabalhadas: 'PT8H0M0S',
      horasExcedentes: 'PT0S',
      horasDevidas: 'PT0S',
      expedientes: [
        {
          dia: '2024-09-15',
          pontos: ['08:00:00', '12:00:00', '13:00:00', '17:00:00'],
        },
      ],
    };

    mockReportUseCase.execute.mockResolvedValue(mockReport);

    const result = await timeSheetsController.getTimesheet('2024-09');

    expect(result).toEqual(mockReport);
    expect(reportUseCase.execute).toHaveBeenCalledWith('2024-09');
  });

  it('should throw NotFoundException if the report is not found', async () => {
    mockReportUseCase.execute.mockRejectedValue(
      new NotFoundException('Relatório não encontrado'),
    );

    await expect(timeSheetsController.getTimesheet('2024-09')).rejects.toThrow(
      NotFoundException,
    );
    expect(reportUseCase.execute).toHaveBeenCalledWith('2024-09');
  });

  it('should handle BadRequestException if there is an invalid parameter', async () => {
    mockReportUseCase.execute.mockRejectedValue(
      new NotFoundException('Invalid parameter'),
    );

    await expect(
      timeSheetsController.getTimesheet('invalid-param'),
    ).rejects.toThrow(NotFoundException);
    expect(reportUseCase.execute).toHaveBeenCalledWith('invalid-param');
  });
});
