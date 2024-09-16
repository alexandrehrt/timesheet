import { Body, Controller, Post } from '@nestjs/common';
import { CreateBatidaUseCase } from './create-batida.usecase';
import { CreateBatidaDto } from './dto/create-batida.dto';

@Controller('batidas')
export class BatidasController {
  constructor(private readonly createBatidaUseCase: CreateBatidaUseCase) {}

  @Post()
  create(
    @Body() createBatidaDto: CreateBatidaDto,
  ): Promise<{ dia: string; pontos: string[] }> {
    return this.createBatidaUseCase.execute(createBatidaDto);
  }
}
