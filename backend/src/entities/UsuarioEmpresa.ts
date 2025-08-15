import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { BaseEntity } from '@/core/base/BaseEntity';
import { User } from '@/entities/User';
import { Empresa } from '@/entities/Empresa';
import { Role } from '@/entities/Role';
import { Funcionario } from '@/entities/Funcionario';
import { TarefaHistoria } from '@/entities/TarefaHistoria';
import { PedidoCompra } from '@/entities/PedidoCompra';

@Entity('usuario_empresa')
@Unique(['userId', 'empresaId'])
export class UsuarioEmpresa extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'usuario_empresa_id' })
  usuarioEmpresaId!: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: number;

  @Column({ name: 'empresa_id', type: 'bigint' })
  empresaId!: number;

  @Column({ name: 'role_id', type: 'bigint', nullable: true })
  roleId?: number;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.usuarioEmpresas)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Empresa, (empresa) => empresa.usuarioEmpresas)
  @JoinColumn({ name: 'empresa_id' })
  empresa!: Empresa;

  @ManyToOne(() => Role, (role) => role.usuarioEmpresas)
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  @OneToMany(() => Funcionario, (funcionario) => funcionario.usuarioEmpresa)
  funcionarios!: Funcionario[];

  @OneToMany(() => TarefaHistoria, (historia) => historia.usuarioEmpresa)
  tarefaHistorias!: TarefaHistoria[];

  @OneToMany(() => PedidoCompra, (pedido) => pedido.usuarioEmpresaSolicitante)
  pedidosCompraSolicitados!: PedidoCompra[];
}

