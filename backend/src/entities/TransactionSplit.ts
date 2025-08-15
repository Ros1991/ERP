import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './Transaction';
import { CostCenter } from './CostCenter';

@Entity('transaction_splits')
export class TransactionSplit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  transaction_id!: string;

  @Column({ type: 'uuid' })
  cost_center_id!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  // Relationships
  @ManyToOne(() => Transaction, transaction => transaction.splits)
  @JoinColumn({ name: 'transaction_id' })
  transaction!: Transaction;

  @ManyToOne(() => CostCenter, costCenter => costCenter.transaction_splits)
  @JoinColumn({ name: 'cost_center_id' })
  cost_center!: CostCenter;
}

