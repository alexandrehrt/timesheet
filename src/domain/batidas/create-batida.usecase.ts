import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { differenceInMinutes, isEqual, parse } from 'date-fns';
import { BatidaRepositoryInterface } from './batidas.repository';
import { CreateBatidaDto } from './dto/create-batida.dto';
import { Batida } from './entities/batida.entity';

@Injectable()
export class CreateBatidaUseCase {
  constructor(
    @Inject('BatidaRepositoryInterface')
    private readonly batidaRepository: BatidaRepositoryInterface,
  ) {}

  async execute(createBatidaDto: CreateBatidaDto) {
    const [date, time] = createBatidaDto.momento.split('T');

    const dayEntries = await this.batidaRepository.findByDate(date);

    if (dayEntries.length >= 4) {
      throw new BadRequestException(
        'Apenas 4 horários podem ser registrados por dia',
      );
    }

    const isWeekend = this.checkIfIsWeekend(date);
    if (isWeekend) {
      throw new BadRequestException(
        'Sábado e domingo não são permitidos como dia de trabalho',
      );
    }

    const timeAlreadyRegistered = this.checkIfTimeIsRegistered(
      time,
      dayEntries,
    );
    if (timeAlreadyRegistered) {
      throw new ConflictException('Horário já registrado');
    }

    if (dayEntries.length === 2) {
      const isLunchTime = this.checkIfIsLunchTime(time, dayEntries[1].time);

      if (isLunchTime) {
        throw new BadRequestException('Deve haver no mínimo 1 hora de almoço');
      }
    }

    const entries = await this.batidaRepository.create({ date, time });

    return {
      dia: date,
      pontos: entries.map((batida) => batida.time),
    };
  }

  private checkIfIsWeekend(date: string) {
    const dayOfWeek = new Date(date).getUTCDay();
    return dayOfWeek === 6 || dayOfWeek === 0;
  }

  private checkIfTimeIsRegistered(time: string, dayEntries: Batida[]) {
    const formattedTime = parse(time, 'HH:mm:ss', new Date());
    return dayEntries.some((batida) => {
      const existingTime = parse(batida.time, 'HH:mm:ss', new Date());
      return isEqual(formattedTime, existingTime);
    });
  }

  private checkIfIsLunchTime(newEntry: string, secondEntry: string) {
    const parsedNewEntry = parse(newEntry, 'HH:mm:ss', new Date());
    const parsedSecondEntry = parse(secondEntry, 'HH:mm:ss', new Date());
    const diff = differenceInMinutes(parsedNewEntry, parsedSecondEntry);

    return diff < 60;
  }
}
