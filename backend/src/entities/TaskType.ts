import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Company } from './Company';
import { CostCenter } from './CostCenter';
import { User } from './User';
import { Task } from './Task';

export enum TaskTypeStatus {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo'
}

@Entity('task_types')
@Unique(['company_id', 'name'])
export class TaskType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  company_id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'uuid', nullable: true })
  default_cost_center_id: string | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  estimated_duration_hours: number | null;

  @Column({ type: 'boolean', default: false })
  requires_approval!: boolean;

  @Column({ type: 'uuid', nullable: true })
  default_approver_id: string | null;

  @Column({ type: 'json', nullable: true })
  default_instructions: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon!: string | null;

  @Column({ type: 'enum', enum: TaskTypeStatus, default: TaskTypeStatus.ATIVO })
  status!: TaskTypeStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => CostCenter, { nullable: true })
  @JoinColumn({ name: 'default_cost_center_id' })
  default_cost_center: CostCenter | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'default_approver_id' })
  default_approver: User | null;

  @OneToMany(() => Task, task => task.task_type)
  tasks!: any[];
}

