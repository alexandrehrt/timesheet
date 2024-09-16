import { Controller, Get, Param } from '@nestjs/common';
import { ReportDto } from './dto/report.dto';
import { ReportUseCase } from './report.usecase';

@Controller('folhas-de-ponto')
export class TimeSheetsController {
  constructor(private readonly reportUseCase: ReportUseCase) {}

  @Get(':anoMes')
  getTimesheet(@Param('anoMes') anoMes: string): Promise<ReportDto> {
    return this.reportUseCase.execute(anoMes);
  }
}
