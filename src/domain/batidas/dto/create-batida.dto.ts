import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateBatidaDto {
  @IsDateString({}, { message: 'Data e hora em formato inválido' })
  @IsNotEmpty({ message: 'Campo obrigatório não informado' })
  momento: string;
}
