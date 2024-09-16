import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatidaRepository } from '../batidas/batidas.repository';
import { Batida } from '../batidas/entities/batida.entity';
import { ReportUseCase } from './report.usecase';
import { TimeSheetsController } from './timesheets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Batida])],
  controllers: [TimeSheetsController],
  providers: [
    ReportUseCase,
    BatidaRepository,
    {
      provide: 'BatidaRepositoryInterface',
      useExisting: BatidaRepository,
    },
  ],
})
export class TimeSheetsModule {}
