import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from './Employee';
import { PayrollPeriod } from './PayrollPeriod';
import { User } from './User';

@Entity('employee_timesheets')
export class EmployeeTimeSheet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  employee_id!: string;

  @Column({ type: 'uuid' })
  payroll_period_id!: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  total_worked_hours!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  regular_hours!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  overtime_hours!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  night_shift_hours!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  weekend_hours!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  holiday_hours!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  absent_hours!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  justified_absent_hours!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  vacation_hours!: number;

  @Column({ type: 'integer', default: 0 })
  days_worked!: number;

  @Column({ type: 'json', nullable: true })
  calculation_details: any | null;

  @CreateDateColumn()
  generated_at!: Date;

  @Column({ type: 'uuid', nullable: true })
  approved_by_user_id!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  approved_at!: Date | null;

  // Relationships
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @ManyToOne(() => PayrollPeriod, period => period.employee_timesheets)
  @JoinColumn({ name: 'payroll_period_id' })
  payroll_period!: PayrollPeriod;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by_user_id' })
  approved_by!: User | null;
}

