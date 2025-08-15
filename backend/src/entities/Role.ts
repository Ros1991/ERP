import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Company } from './Company';
import { CompanyMember } from './CompanyMember';

@Entity('roles')
@Unique(['company_id', 'name'])
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid' })
  company_id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'json' })
  permissions!: any[];

  // Relationships
  @ManyToOne(() => Company, company => company.roles)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @OneToMany(() => CompanyMember, companyMember => companyMember.role)
  company_members!: any[];
}

