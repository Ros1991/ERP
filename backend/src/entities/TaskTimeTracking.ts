import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from './Task';
import { Employee } from './Employee';

export enum TrackingAction {
  INICIO = 'Inicio',
  PAUSA = 'Pausa',
  RETOMADA = 'Retomada',
  FIM = 'Fim'
}

@Entity('task_time_tracking')
export class TaskTimeTracking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  task_id!: string;

  @Column({ type: 'uuid' })
  employee_id!: string;

  @Column({ type: 'enum', enum: TrackingAction })
  action: TrackingAction;

  @Column({ type: 'timestamp' })
  timestamp!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  duration_hours: number | null;

  @CreateDateColumn()
  created_at!: Date;

  // Relationships
  @ManyToOne(() => Task, task => task.time_tracking)
  @JoinColumn({ name: 'task_id' })
  task!: Task;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;
}

