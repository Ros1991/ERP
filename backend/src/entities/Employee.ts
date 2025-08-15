import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Company } from './Company';
import { CompanyMember } from './CompanyMember';
import { EmployeeDocument } from './EmployeeDocument';
import { EmployeeLedger } from './EmployeeLedger';

export enum ContractType {
  CLT = 'CLT',
  DIARISTA = 'Diarista',
  EMPREITA = 'Empreita'
}

export enum EmployeeStatus {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
  AFASTADO = 'Afastado',
  DEMITIDO = 'Demitido'
}

@Entity('employees')
@Unique(['company_id', 'cpf'])
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  company_id!: string;

  @Column({ type: 'uuid', nullable: true })
  company_member_id!: string | null;

  @Column({ type: 'varchar', length: 255 })
  full_name!: string;

  @Column({ type: 'varchar', length: 14 })
  cpf!: string;

  @Column({ type: 'varchar', length: 255 })
  job_title!: string;

  @Column({ type: 'enum', enum: ContractType })
  contract_type!: ContractType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary_base!: number;

  @Column({ type: 'date' })
  hire_date!: Date;

  @Column({ type: 'date', nullable: true })
  termination_date!: Date | null;

  @Column({ type: 'enum', enum: EmployeeStatus, default: EmployeeStatus.ATIVO })
  status!: EmployeeStatus;

  @Column({ type: 'boolean', default: true })
  config_tracks_time!: boolean;

  @Column({ type: 'boolean', default: true })
  config_is_in_payroll!: boolean;

  @Column({ type: 'json' })
  legal_data!: {
    address: string;
    phone: string;
    emergency_contact: string;
    bank_details: {
      bank: string;
      agency: string;
      account: string;
    };
    pis: string;
    dependents: any[];
  };

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => Company, company => company.employees)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @OneToOne(() => CompanyMember, companyMember => companyMember.employee)
  @JoinColumn({ name: 'company_member_id' })
  company_member!: CompanyMember;

  @OneToMany(() => EmployeeDocument, document => document.employee)
  documents!: EmployeeDocument[];

  @OneToMany(() => EmployeeLedger, ledger => ledger.employee)
  ledger_entries!: EmployeeLedger[];
}

