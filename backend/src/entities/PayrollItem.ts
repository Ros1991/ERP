import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PayrollPeriod } from './PayrollPeriod';
import { Employee } from './Employee';

export enum PayrollItemType {
  SALARIO_BASE = 'Salario_Base',
  HORAS_EXTRAS = 'Horas_Extras',
  ADICIONAL_NOTURNO = 'Adicional_Noturno',
  DSR = 'DSR',
  FERIAS = 'Ferias',
  DECIMO_TERCEIRO = 'Decimo_Terceiro',
  DESCONTO_INSS = 'Desconto_INSS',
  DESCONTO_IRRF = 'Desconto_IRRF',
  DESCONTO_FGTS = 'Desconto_FGTS',
  DESCONTO_ADIANTAMENTO = 'Desconto_Adiantamento',
  DESCONTO_FALTA = 'Desconto_Falta',
  BENEFICIO_VALE_TRANSPORTE = 'Beneficio_Vale_Transporte',
  BENEFICIO_VALE_REFEICAO = 'Beneficio_Vale_Refeicao',
  OUTROS_PROVENTOS = 'Outros_Proventos',
  OUTROS_DESCONTOS = 'Outros_Descontos'
}

@Entity('payroll_items')
export class PayrollItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  payroll_period_id!: string;

  @Column({ type: 'uuid' })
  employee_id!: string;

  @Column({ type: 'enum', enum: PayrollItemType })
  item_type!: PayrollItemType;

  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  calculation_basis!: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  rate!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Column({ type: 'boolean', default: true })
  is_taxable!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  legal_reference!: string | null;

  @Column({ type: 'json', nullable: true })
  calculation_details: any | null;

  @CreateDateColumn()
  created_at!: Date;

  // Relationships
  @ManyToOne(() => PayrollPeriod, period => period.payroll_items)
  @JoinColumn({ name: 'payroll_period_id' })
  payroll_period!: PayrollPeriod;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;
}

