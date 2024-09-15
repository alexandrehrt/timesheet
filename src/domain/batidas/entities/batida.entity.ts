import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Batida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;
}
