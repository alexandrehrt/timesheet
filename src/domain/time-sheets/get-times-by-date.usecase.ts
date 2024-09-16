import { Inject, Injectable } from '@nestjs/common';
import { BatidaRepositoryInterface } from '../batidas/batidas.repository';
import { GetTimesByDateDto } from './dto/get-times-by-date.dto';

@Injectable()
export class GetTimesByDateUseCase {
  constructor(
    @Inject('BatidaRepositoryInterface')
    private readonly batidaRepository: BatidaRepositoryInterface,
  ) {}

  async execute(date: string): Promise<GetTimesByDateDto> {
    return {
      anoMes: date,
      horasTrabalhadas: '0',
      horasExcedentes: '0',
      horasDevidas: '0',
      expedientes: [],
    };
  }
}
