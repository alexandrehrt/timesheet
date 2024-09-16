import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { differenceInMilliseconds, parseISO } from 'date-fns';
import { BatidaRepositoryInterface } from '../batidas/batidas.repository';
import { Batida } from '../batidas/entities/batida.entity';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportUseCase {
  constructor(
    @Inject('BatidaRepositoryInterface')
    private readonly batidaRepository: BatidaRepositoryInterface,
  ) {}

  async execute(anoMes: string): Promise<ReportDto> {
    const batidas = await this.batidaRepository.findByMonth(anoMes);

    if (batidas.length === 0) {
      throw new NotFoundException('Relatório não encontrado');
    }

    const expedientes = this.organizeExpedientes(batidas);

    const { horasTrabalhadas, horasExcedentes, horasDevidas } =
      this.calculateHorasTrabalhadas(expedientes);

    return {
      anoMes,
      horasTrabalhadas,
      horasExcedentes,
      horasDevidas,
      expedientes,
    };
  }

  private organizeExpedientes(
    batidas: Batida[],
  ): { dia: string; pontos: string[] }[] {
    const expedienteMap = new Map<string, string[]>();

    for (const batida of batidas) {
      if (!expedienteMap.has(batida.date)) {
        expedienteMap.set(batida.date, []);
      }
      expedienteMap.get(batida.date).push(batida.time);
    }

    return Array.from(expedienteMap.entries()).map(([dia, pontos]) => ({
      dia,
      pontos: pontos.sort(),
    }));
  }

  private calculateHorasTrabalhadas(
    expedientes: { dia: string; pontos: string[] }[],
  ): {
    horasTrabalhadas: string;
    horasExcedentes: string;
    horasDevidas: string;
  } {
    let totalMilis = 0;
    let totalHorasExtrasMilis = 0;
    let totalHorasDevidasMilis = 0;

    for (const expediente of expedientes) {
      const { pontos } = expediente;

      if (pontos.length % 2 !== 0) {
        throw new BadRequestException('Expediente inválido');
      }

      let expedienteMilis = 0;
      for (let i = 0; i < pontos.length - 1; i += 2) {
        const start = parseISO(`${expediente.dia}T${pontos[i]}`);
        const end = parseISO(`${expediente.dia}T${pontos[i + 1]}`);

        expedienteMilis += differenceInMilliseconds(end, start);
      }

      totalMilis += Math.max(0, expedienteMilis);

      const EIGHT_HOURS_IN_MS = 28800000;
      if (expedienteMilis < EIGHT_HOURS_IN_MS) {
        totalHorasDevidasMilis += EIGHT_HOURS_IN_MS - expedienteMilis;
      }

      if (expedienteMilis > EIGHT_HOURS_IN_MS) {
        totalHorasExtrasMilis += expedienteMilis - EIGHT_HOURS_IN_MS;
      }
    }

    const balance = totalHorasExtrasMilis - totalHorasDevidasMilis;
    if (balance > 0) {
      totalHorasExtrasMilis = balance;
      totalHorasDevidasMilis = 0;
    } else {
      totalHorasExtrasMilis = 0;
      totalHorasDevidasMilis = Math.abs(balance);
    }

    const horasTrabalhadas = this.formatDuration(totalMilis);
    const horasExcedentes = this.formatDuration(totalHorasExtrasMilis);
    const horasDevidas = this.formatDuration(totalHorasDevidasMilis);

    return {
      horasTrabalhadas,
      horasExcedentes,
      horasDevidas,
    };
  }

  private formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours === 0 && minutes === 0 && seconds === 0) {
      return 'PT0S';
    }

    let result = 'PT';
    if (hours > 0) result += `${hours}H`;
    if (minutes > 0 || (minutes === 0 && seconds > 0)) result += `${minutes}M`;
    if (seconds > 0) result += `${seconds}S`;

    return result;
  }
}
