import { Injectable } from '@nestjs/common';
import { CreateBatidaDto } from './dto/create-batida.dto';

@Injectable()
export class CreateBatidaUseCase {
  execute(createBatidaDto: CreateBatidaDto) {
    return createBatidaDto;
  }
}
