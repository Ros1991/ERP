import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Unique } from 'typeorm';
import { SoftDeleteBaseEntity } from '@/core/base/BaseEntity';
import { Empresa } from '@/entities/Empresa';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';

@Entity('role')
@Unique(['empresaId', 'nome'])
export class Role extends SoftDeleteBaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'role_id' })
  roleId!: number;

  @Column({ name: 'empresa_id', type: 'bigint' })
  empresaId!: number;

  @Column({ name: 'nome', type: 'varchar', length: 100 })
  nome!: string;

  @Column({ name: 'permissoes', type: 'jsonb', nullable: true })
  permissoes?: any;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  // Relationships
  @ManyToOne(() => Empresa, (empresa) => empresa.roles)
  @JoinColumn({ name: 'empresa_id' })
  empresa!: Empresa;

  @OneToMany(() => UsuarioEmpresa, (usuarioEmpresa) => usuarioEmpresa.role)
  usuarioEmpresas!: UsuarioEmpresa[];
}

