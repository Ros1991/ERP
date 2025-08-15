import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Company } from './Company';
import { CompanyMember } from './CompanyMember';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true, transformer: {
    to: (value: string) => value?.toLowerCase(),
    from: (value: string) => value
  }})
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash!: string;

  @Column({ type: 'text', nullable: true })
  facial_recognition_vector!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @OneToMany(() => Company, company => company.owner)
  owned_companies!: any[];

  @OneToMany(() => CompanyMember, companyMember => companyMember.user)
  company_memberships!: any[];
}

