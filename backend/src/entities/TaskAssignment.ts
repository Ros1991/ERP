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

export enum AssignmentType {
  PRINCIPAL = 'Principal',
  AUXILIAR = 'Auxiliar',
  SUPERVISOR = 'Supervisor'
}

@Entity('task_assignments')
export class TaskAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  task_id!: string;

  @Column({ type: 'uuid' })
  employee_id!: string;

  @Column({ type: 'enum', enum: AssignmentType })
  assignment_type: AssignmentType;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  estimated_hours!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  actual_hours!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourly_rate: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_cost: number | null;

  @CreateDateColumn()
  assigned_at!: Date;

  // Relationships
  @ManyToOne(() => Task, task => task.assignments)
  @JoinColumn({ name: 'task_id' })
  task!: Task;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;
}

