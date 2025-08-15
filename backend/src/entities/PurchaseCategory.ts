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
import { User } from './User';
import { PurchaseRequest } from './PurchaseRequest';

export enum CategoryStatus {
  ATIVA = 'Ativa',
  INATIVA = 'Inativa'
}

@Entity('purchase_categories')
export class PurchaseCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  company_id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'uuid', nullable: true })
  default_approver_id: string | null;

  @Column({ type: 'boolean', default: false })
  requires_justification!: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  budget_limit: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color!: string | null;

  @Column({ type: 'enum', enum: CategoryStatus, default: CategoryStatus.ATIVA })
  status!: CategoryStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'default_approver_id' })
  default_approver: User | null;

  @OneToMany(() => PurchaseRequest, request => request.category)
  purchase_requests!: any[];
}

