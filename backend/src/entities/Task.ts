import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Company } from './Company';
import { TaskType } from './TaskType';
import { CostCenter } from './CostCenter';
import { User } from './User';
import { TaskAssignment } from './TaskAssignment';
import { TaskTimeTracking } from './TaskTimeTracking';
import { TaskHistory } from './TaskHistory';
import { TaskComment } from './TaskComment';
import { TaskAttachment } from './TaskAttachment';

export enum TaskPriority {
  BAIXA = 'Baixa',
  MEDIA = 'Media',
  ALTA = 'Alta',
  URGENTE = 'Urgente'
}

export enum TaskStatus {
  PENDENTE = 'Pendente',
  APROVADA = 'Aprovada',
  EM_ANDAMENTO = 'Em_Andamento',
  PAUSADA = 'Pausada',
  PARADA = 'Parada',
  CONCLUIDA = 'Concluida',
  CANCELADA = 'Cancelada',
  REJEITADA = 'Rejeitada'
}

export enum FrequencyType {
  UNICA = 'Unica',
  DIARIA = 'Diaria',
  SEMANAL = 'Semanal',
  MENSAL = 'Mensal',
  ANUAL = 'Anual'
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  company_id!: string;

  @Column({ type: 'uuid' })
  task_type_id!: string;

  @Column({ type: 'uuid' })
  cost_center_id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: TaskPriority })
  priority!: TaskPriority;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDENTE })
  status!: TaskStatus;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  estimated_hours!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  actual_hours!: number | null;

  @Column({ type: 'date' })
  estimated_start_date!: Date;

  @Column({ type: 'date' })
  due_date!: Date;

  @Column({ type: 'date', nullable: true })
  actual_start_date: Date | null;

  @Column({ type: 'date', nullable: true })
  actual_end_date: Date | null;

  @Column({ type: 'enum', enum: FrequencyType, default: FrequencyType.UNICA })
  frequency_type: FrequencyType;

  @Column({ type: 'json', nullable: true })
  frequency_config: any | null;

  @Column({ type: 'uuid', nullable: true })
  parent_task_id: string | null;

  @Column({ type: 'text', nullable: true })
  instructions: string | null;

  @Column({ type: 'text', nullable: true })
  completion_notes: string | null;

  @Column({ type: 'integer', nullable: true })
  quality_rating: number | null;

  @Column({ type: 'uuid' })
  created_by_user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  approved_by_user_id!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  approved_at!: Date | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => TaskType, taskType => taskType.tasks)
  @JoinColumn({ name: 'task_type_id' })
  task_type!: TaskType;

  @ManyToOne(() => CostCenter)
  @JoinColumn({ name: 'cost_center_id' })
  cost_center!: CostCenter;

  @ManyToOne(() => Task, { nullable: true })
  @JoinColumn({ name: 'parent_task_id' })
  parent_task: Task | null;

  @OneToMany(() => Task, task => task.parent_task)
  child_tasks!: any[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by!: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by_user_id' })
  approved_by!: User | null;

  @OneToMany(() => TaskAssignment, assignment => assignment.task)
  assignments!: any[];

  @OneToMany(() => TaskTimeTracking, tracking => tracking.task)
  time_tracking!: any[];

  @OneToMany(() => TaskHistory, history => history.task)
  history!: any[];

  @OneToMany(() => TaskComment, comment => comment.task)
  comments!: any[];

  @OneToMany(() => TaskAttachment, attachment => attachment.task)
  attachments!: any[];
}

