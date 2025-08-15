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
import { PayrollItem } from './PayrollItem';
import { EmployeeTimeSheet } from './EmployeeTimeSheet';

export enum PeriodType {
  MENSAL = 'Mensal',
  QUINZENAL = 'Quinzenal',
  SEMANAL = 'Semanal'
}

export enum PayrollStatus {
  ABERTO = 'Aberto',
  EM_PROCESSAMENTO = 'Em_Processamento',
  FECHADO = 'Fechado',
  PAGO = 'Pago',
  CANCELADO = 'Cancelado'
}

@Entity('payroll_periods')
export class PayrollPeriod {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  company_id!: string;

  @Column({ type: 'integer', width: 2 })
  period_month!: number;

  @Column({ type: 'integer', width: 4 })
  period_year!: number;

  @Column({ type: 'enum', enum: PeriodType })
  period_type!: PeriodType;

  @Column({ type: 'date' })
  start_date!: Date;

  @Column({ type: 'date' })
  end_date!: Date;

  @Column({ type: 'date' })
  cutoff_date!: Date;

  @Column({ type: 'enum', enum: PayrollStatus, default: PayrollStatus.ABERTO })
  status!: PayrollStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_gross_amount!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_net_amount!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_taxes!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_benefits!: number;

  @Column({ type: 'timestamp', nullable: true })
  processed_at!: Date | null;

  @Column({ type: 'uuid', nullable: true })
  processed_by_user_id!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  approved_at!: Date | null;

  @Column({ type: 'uuid', nullable: true })
  approved_by_user_id!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'processed_by_user_id' })
  processed_by!: User | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by_user_id' })
  approved_by!: User | null;

  @OneToMany(() => PayrollItem, item => item.payroll_period)
  payroll_items!: any[];

  @OneToMany(() => EmployeeTimeSheet, timesheet => timesheet.payroll_period)
  employee_timesheets!: any[];
}

