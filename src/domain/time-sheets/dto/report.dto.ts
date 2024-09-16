import { IsString } from 'class-validator';

export class ReportDto {
  @IsString()
  anoMes: string;

  @IsString()
  horasTrabalhadas: string;

  @IsString()
  horasExcedentes: string;

  @IsString()
  horasDevidas: string;

  expedientes: {
    dia: string;
    pontos: string[];
  }[];
}
