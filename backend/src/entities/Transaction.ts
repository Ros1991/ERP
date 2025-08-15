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
import { FinancialAccount } from './FinancialAccount';
import { Employee } from './Employee';
import { User } from './User';
import { TransactionSplit } from './TransactionSplit';

export enum TransactionCategory {
  RECEITA = 'Receita',
  DESPESA = 'Despesa',
  TRANSFERENCIA = 'Transferencia',
  ADIANTAMENTO = 'Adiantamento',
  EMPRESTIMO = 'Emprestimo'
}

export enum PaymentMethod {
  DINHEIRO = 'Dinheiro',
  PIX = 'PIX',
  TED = 'TED',
  CARTAO_DEBITO = 'Cartao_Debito',
  CARTAO_CREDITO = 'Cartao_Credito',
  BOLETO = 'Boleto',
  CHEQUE = 'Cheque'
}

export enum TransactionStatus {
  PENDENTE = 'Pendente',
  CONFIRMADA = 'Confirmada',
  CANCELADA = 'Cancelada',
  ESTORNADA = 'Estornada'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  company_id!: string;

  @Column({ type: 'uuid' })
  financial_account_id!: string;

  @Column({ type: 'varchar', length: 50 })
  transaction_number!: string;

  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Column({ type: 'date' })
  transaction_date!: Date;

  @Column({ type: 'date', nullable: true })
  due_date!: Date | null;

  @Column({ type: 'enum', enum: TransactionCategory })
  category!: TransactionCategory;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ type: 'uuid', nullable: true })
  related_employee_id: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  invoice_number: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  supplier_customer: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDENTE })
  status!: TransactionStatus;

  @Column({ type: 'uuid' })
  created_by_user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  approved_by_user_id!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => Company, company => company.transactions)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => FinancialAccount, account => account.transactions)
  @JoinColumn({ name: 'financial_account_id' })
  financial_account!: FinancialAccount;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'related_employee_id' })
  related_employee: Employee | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by!: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by_user_id' })
  approved_by!: User | null;

  @OneToMany(() => TransactionSplit, split => split.transaction)
  splits!: any[];
}

