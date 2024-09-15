import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilterMock } from 'src/common/filters/http-exception.filter.mock';
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
    })
      .overrideProvider(HttpExceptionFilterMock)
      .useValue(new HttpExceptionFilterMock())
      .compile();

    controller = module.get<BatidasController>(BatidasController);

    jest.clearAllMocks();
  });

  it('deve criar uma batida com sucesso e retornar os horários do dia', async () => {
    const createBatidaDto: CreateBatidaDto = { momento: '2024-09-15T08:00:00' };
    const result = { dia: '2024-09-15', pontos: ['08:00:00', '12:00:00'] };
    mockCreateBatidaUseCase.execute.mockResolvedValue(result);

    const response = await controller.create(createBatidaDto);

    expect(response).toEqual(result);
    expect(mockCreateBatidaUseCase.execute).toHaveBeenCalledWith(
      createBatidaDto,
    );
  });

  it('deve lançar uma exceção quando o use case retornar erro', async () => {
    const createBatidaDto: CreateBatidaDto = { momento: '2024-09-15T08:00:00' };
    mockCreateBatidaUseCase.execute.mockRejectedValue(
      new BadRequestException('Erro de validação'),
    );

    try {
      await controller.create(createBatidaDto);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Erro de validação');
    }
  });
});
