import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { GetTimesByDateDto } from './dto/get-times-by-date.dto';
import { GetTimesByDateUseCase } from './get-times-by-date.usecase';

@Controller('folhas-de-ponto')
export class TimeSheetsController {
  constructor(private readonly getTimesByDateUseCase: GetTimesByDateUseCase) {}

  @Get(':anoMes')
  @UseFilters(new HttpExceptionFilter())
  getTimesheet(@Param('anoMes') anoMes: string): Promise<GetTimesByDateDto> {
    return this.getTimesByDateUseCase.execute(anoMes);
  }
}
