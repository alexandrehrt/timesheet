import { Module } from '@nestjs/common';
import { BatidasController } from './batidas.controller';
import { CreateBatidaUseCase } from './create-batida.usecase';

@Module({
  controllers: [BatidasController],
  providers: [CreateBatidaUseCase],
})
export class BatidasModule {}
