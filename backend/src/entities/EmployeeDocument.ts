import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from './Employee';
import { User } from './User';

export enum DocumentType {
  RG = 'RG',
  CPF = 'CPF',
  CARTEIRA_TRABALHO = 'Carteira_Trabalho',
  COMPROVANTE_RESIDENCIA = 'Comprovante_Residencia',
  ATESTADO_MEDICO = 'Atestado_Medico',
  OUTROS = 'Outros'
}

@Entity('employee_documents')
export class EmployeeDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  employee_id!: string;

  @Column({ type: 'enum', enum: DocumentType })
  document_type!: DocumentType;

  @Column({ type: 'varchar', length: 500 })
  file_url!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @Column({ type: 'uuid' })
  uploaded_by_user_id!: string;

  @CreateDateColumn()
  uploaded_at!: Date;

  // Relationships
  @ManyToOne(() => Employee, employee => employee.documents)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploaded_by!: User;
}

