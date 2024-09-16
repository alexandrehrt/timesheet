export type GetTimesByDateDto = {
  anoMes: string;
  horasTrabalhadas: string;
  horasExcedentes: string;
  horasDevidas: string;
  expedientes: Expediente[];
};

type Expediente = {
  dia: string;
  pontos: string[];
};
