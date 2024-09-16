import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BatidasController } from './batidas.controller';
import { CreateBatidaUseCase } from './create-batida.usecase';
import { CreateBatidaDto } from './dto/create-batida.dto';

describe('BatidasController', () => {
  let controller: BatidasController;

  const mockCreateBatidaUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatidasController],
      providers: [
        {
          provide: CreateBatidaUseCase,
          useValue: mockCreateBatidaUseCase,
        },
      ],
    }).compile();

    controller = module.get<BatidasController>(BatidasController);

    jest.clearAllMocks();
  });

  it('should create a batida with success and return the day hours', async () => {
    const createBatidaDto: CreateBatidaDto = { momento: '2024-09-15T08:00:00' };
    const result = { dia: '2024-09-15', pontos: ['08:00:00', '12:00:00'] };
    mockCreateBatidaUseCase.execute.mockResolvedValue(result);

    const response = await controller.create(createBatidaDto);

    expect(response).toEqual(result);
    expect(mockCreateBatidaUseCase.execute).toHaveBeenCalledWith(
      createBatidaDto,
    );
  });

  it('should throw an exception when the use case returns an error', async () => {
    const createBatidaDto: CreateBatidaDto = { momento: '2024-09-15T08:00:00' };
    mockCreateBatidaUseCase.execute.mockRejectedValue(
      new BadRequestException('Validation error'),
    );

    try {
      await controller.create(createBatidaDto);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Validation error');
    }
  });
});
