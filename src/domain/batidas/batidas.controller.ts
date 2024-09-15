import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { CreateBatidaUseCase } from './create-batida.usecase';
import { CreateBatidaDto } from './dto/create-batida.dto';

@Controller('batidas')
export class BatidasController {
  constructor(private readonly createBatidaUseCase: CreateBatidaUseCase) {}

  @Post()
  @UseFilters(new HttpExceptionFilter())
  create(@Body() createBatidaDto: CreateBatidaDto) {
    return this.createBatidaUseCase.execute(createBatidaDto);
  }
}
