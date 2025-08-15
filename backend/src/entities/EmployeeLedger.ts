import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from './Employee';
import { Transaction } from './Transaction';
import { User } from './User';

@Entity('employee_ledger')
export class EmployeeLedger {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  employee_id!: string;

  @Column({ type: 'uuid', nullable: true })
  transaction_id!: string | null;

  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Column({ type: 'date' })
  entry_date!: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  balance_after!: number;

  @Column({ type: 'uuid' })
  created_by_user_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  // Relationships
  @ManyToOne(() => Employee, employee => employee.ledger_entries)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @ManyToOne(() => Transaction, { nullable: true })
  @JoinColumn({ name: 'transaction_id' })
  transaction!: Transaction | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by!: User;
}

