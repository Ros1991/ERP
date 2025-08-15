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
import { TransactionSplit } from './TransactionSplit';

export enum CostCenterStatus {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo'
}

@Entity('cost_centers')
@Unique(['company_id', 'name'])
export class CostCenter {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  company_id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'uuid', nullable: true })
  parent_id!: string | null;

  @Column({ type: 'enum', enum: CostCenterStatus, default: CostCenterStatus.ATIVO })
  status!: CostCenterStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => Company, company => company.cost_centers)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => CostCenter, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent!: CostCenter | null;

  @OneToMany(() => CostCenter, costCenter => costCenter.parent)
  children!: CostCenter[];

  @OneToMany(() => TransactionSplit, split => split.cost_center)
  transaction_splits!: TransactionSplit[];
}

