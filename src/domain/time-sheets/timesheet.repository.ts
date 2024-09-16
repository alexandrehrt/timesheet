import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Batida } from '../batidas/entities/batida.entity';

export interface TimeSheetRepositoryInterface {
  getTimesByDate(date: string): Promise<any>;
}

@Injectable()
export class TimeSheetRepository implements TimeSheetRepositoryInterface {
  constructor(
    @InjectRepository(Batida)
    private readonly batidaRepository: Repository<Batida>,
  ) {}

  async getTimesByDate(date: string): Promise<any> {
    console.log('repository', date);
  }
}
