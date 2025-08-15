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
import { PurchaseCategory } from './PurchaseCategory';
import { CostCenter } from './CostCenter';
import { Employee } from './Employee';
import { User } from './User';
import { PurchaseItem } from './PurchaseItem';
import { PurchaseAttachment } from './PurchaseAttachment';
import { PurchaseComment } from './PurchaseComment';

export enum RequestPriority {
  BAIXA = 'Baixa',
  MEDIA = 'Media',
  ALTA = 'Alta',
  URGENTE = 'Urgente'
}

export enum RequestStatus {
  PENDENTE = 'Pendente',
  EM_ANALISE = 'Em_Analise',
  APROVADA = 'Aprovada',
  REJEITADA = 'Rejeitada',
  COMPRADA = 'Comprada',
  ENTREGUE = 'Entregue',
  CANCELADA = 'Cancelada'
}

@Entity('purchase_requests')
export class PurchaseRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  company_id!: string;

  @Column({ type: 'uuid' })
  category_id!: string;

  @Column({ type: 'uuid' })
  cost_center_id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', nullable: true })
  justification!: string | null;

  @Column({ type: 'enum', enum: RequestPriority })
  priority!: RequestPriority;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimated_total_cost: number | null;

  @Column({ type: 'date', nullable: true })
  requested_delivery_date: Date | null;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDENTE })
  status!: RequestStatus;

  @Column({ type: 'uuid', nullable: true })
  requested_by_employee_id: string | null;

  @Column({ type: 'uuid' })
  requested_by_user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  assigned_buyer_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  approved_by_user_id!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  approved_at!: Date | null;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string | null;

  @Column({ type: 'text', nullable: true })
  purchase_notes: string | null;

  @Column({ type: 'text', nullable: true })
  delivery_notes: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => PurchaseCategory, category => category.purchase_requests)
  @JoinColumn({ name: 'category_id' })
  category!: PurchaseCategory;

  @ManyToOne(() => CostCenter)
  @JoinColumn({ name: 'cost_center_id' })
  cost_center!: CostCenter;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'requested_by_employee_id' })
  requested_by_employee: Employee | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requested_by_user_id' })
  requested_by_user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_buyer_id' })
  assigned_buyer: User | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by_user_id' })
  approved_by!: User | null;

  @OneToMany(() => PurchaseItem, item => item.purchase_request)
  items!: any[];

  @OneToMany(() => PurchaseAttachment, attachment => attachment.purchase_request)
  attachments!: any[];

  @OneToMany(() => PurchaseComment, comment => comment.purchase_request)
  comments!: any[];
}

