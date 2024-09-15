import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatidasController } from './batidas.controller';
import { BatidaRepository } from './batidas.repository';
import { CreateBatidaUseCase } from './create-batida.usecase';
import { Batida } from './entities/batida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Batida])],
  controllers: [BatidasController],
  providers: [
    CreateBatidaUseCase,
    BatidaRepository,
    {
      provide: 'BatidaRepositoryInterface',
      useExisting: BatidaRepository,
    },
  ],
})
export class BatidasModule {}
