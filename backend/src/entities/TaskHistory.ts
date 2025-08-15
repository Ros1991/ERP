import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from './Task';
import { User } from './User';
import { Employee } from './Employee';

export enum HistoryAction {
  CRIADA = 'Criada',
  ATUALIZADA = 'Atualizada',
  APROVADA = 'Aprovada',
  REJEITADA = 'Rejeitada',
  INICIADA = 'Iniciada',
  PAUSADA = 'Pausada',
  RETOMADA = 'Retomada',
  PARADA = 'Parada',
  FINALIZADA = 'Finalizada',
  CANCELADA = 'Cancelada',
  ADIADA = 'Adiada'
}

@Entity('task_history')
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  task_id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  employee_id: string | null;

  @Column({ type: 'enum', enum: HistoryAction })
  action: HistoryAction;

  @Column({ type: 'varchar', length: 100, nullable: true })
  previous_status: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  new_status: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'json', nullable: true })
  field_changes: any | null;

  @CreateDateColumn()
  timestamp!: Date;

  // Relationships
  @ManyToOne(() => Task, task => task.history)
  @JoinColumn({ name: 'task_id' })
  task!: Task;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee | null;
}

