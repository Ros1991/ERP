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
import { User } from './User';
import { Role } from './Role';
import { CompanyMember } from './CompanyMember';
import { Employee } from './Employee';
import { FinancialAccount } from './FinancialAccount';
import { CostCenter } from './CostCenter';
import { Transaction } from './Transaction';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'uuid' })
  owner_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => User, user => user.owned_companies)
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @OneToMany(() => Role, role => role.company)
  roles!: Role[];

  @OneToMany(() => CompanyMember, companyMember => companyMember.company)
  members!: CompanyMember[];

  @OneToMany(() => Employee, employee => employee.company)
  employees!: Employee[];

  @OneToMany(() => FinancialAccount, account => account.company)
  financial_accounts!: FinancialAccount[];

  @OneToMany(() => CostCenter, costCenter => costCenter.company)
  cost_centers!: CostCenter[];

  @OneToMany(() => Transaction, transaction => transaction.company)
  transactions!: Transaction[];
}

