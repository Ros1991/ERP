import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Unique,
} from 'typeorm';
import { User } from './User';
import { Company } from './Company';
import { Role } from './Role';
import { Employee } from './Employee';

@Entity('company_members')
@Unique(['user_id', 'company_id'])
export class CompanyMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid' })
  company_id!: string;

  @Column({ type: 'integer' })
  role_id!: number;

  // Relationships
  @ManyToOne(() => User, user => user.company_memberships)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Company, company => company.members)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => Role, role => role.company_members)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @OneToOne(() => Employee, employee => employee.company_member)
  employee!: Employee;
}

