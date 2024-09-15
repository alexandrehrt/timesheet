import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Batida } from './entities/batida.entity';

export interface BatidaRepositoryInterface {
  create({ date, time }: { date: string; time: string }): Promise<Batida[]>;
  findByDate(date: string): Promise<Batida[]>;
}

@Injectable()
export class BatidaRepository implements BatidaRepositoryInterface {
  constructor(
    @InjectRepository(Batida)
    private readonly batidaRepository: Repository<Batida>,
  ) {}

  async create({
    date,
    time,
  }: {
    date: string;
    time: string;
  }): Promise<Batida[]> {
    const newBatida = new Batida();
    newBatida.date = date;
    newBatida.time = time;

    await this.batidaRepository.save(newBatida);

    return this.findByDate(date);
  }

  async findByDate(date: string): Promise<Batida[]> {
    return await this.batidaRepository.find({
      where: { date },
      order: { time: 'ASC' },
    });
  }
}
