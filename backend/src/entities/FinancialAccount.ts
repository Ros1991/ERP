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
import { Transaction } from './Transaction';

export enum AccountType {
  CONTA_CORRENTE = 'Conta_Corrente',
  CAIXA_FISICO = 'Caixa_Fisico',
  CARTAO_CREDITO = 'Cartao_Credito',
  CONTA_SOCIO = 'Conta_Socio',
  POUPANCA = 'Poupanca',
  INVESTIMENTO = 'Investimento'
}

export enum AccountStatus {
  ATIVA = 'Ativa',
  INATIVA = 'Inativa',
  BLOQUEADA = 'Bloqueada'
}

@Entity('financial_accounts')
export class FinancialAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  company_id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'enum', enum: AccountType })
  type!: AccountType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  initial_balance!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  current_balance!: number;

  @Column({ type: 'uuid', nullable: true })
  owner_user_id!: string | null;

  @Column({ type: 'json', nullable: true })
  bank_details!: {
    bank_name?: string;
    agency?: string;
    account_number?: string;
    account_type?: string;
  } | null;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ATIVA })
  status!: AccountStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => Company, company => company.financial_accounts)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_user_id' })
  owner_user!: User | null;

  @OneToMany(() => Transaction, transaction => transaction.financial_account)
  transactions!: any[];
}

