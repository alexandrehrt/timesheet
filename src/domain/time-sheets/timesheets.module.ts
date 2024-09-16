import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatidaRepository } from '../batidas/batidas.repository';
import { Batida } from '../batidas/entities/batida.entity';
import { GetTimesByDateUseCase } from './get-times-by-date.usecase';
import { TimeSheetRepository } from './timesheet.repository';
import { TimeSheetsController } from './timesheets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Batida])],
  controllers: [TimeSheetsController],
  providers: [
    GetTimesByDateUseCase,
    TimeSheetRepository,
    BatidaRepository,
    {
      provide: 'BatidaRepositoryInterface',
      useExisting: BatidaRepository,
    },
    {
      provide: 'TimeSheetRepositoryInterface',
      useExisting: TimeSheetRepository,
    },
  ],
})
export class TimeSheetsModule {}
