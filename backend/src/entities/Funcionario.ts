import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Unique } from 'typeorm';
import { SoftDeleteBaseEntity } from '@/core/base/BaseEntity';
import { Empresa } from '@/entities/Empresa';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';
import { FuncionarioContrato } from '@/entities/FuncionarioContrato';
import { TarefaTipo } from '@/entities/TarefaTipo';
import { TarefaFuncionarioStatus } from '@/entities/TarefaFuncionarioStatus';
import { Emprestimo } from '@/entities/Emprestimo';

@Entity('funcionario')
@Unique(['empresaId', 'apelido'])
export class Funcionario extends SoftDeleteBaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'funcionario_id' })
  funcionarioId!: number;

  @Column({ name: 'empresa_id', type: 'bigint' })
  empresaId!: number;

  @Column({ name: 'usuario_empresa_id', type: 'bigint', nullable: true })
  usuarioEmpresaId?: number;

  @Column({ name: 'nome', type: 'varchar', length: 255, nullable: true })
  nome?: string;

  @Column({ name: 'apelido', type: 'varchar', length: 255 })
  apelido!: string;

  @Column({ name: 'cpf', type: 'varchar', length: 14, unique: true, nullable: true })
  cpf?: string;

  @Column({ name: 'rg', type: 'varchar', length: 20, nullable: true })
  rg?: string;

  @Column({ name: 'data_nascimento', type: 'date', nullable: true })
  dataNascimento?: Date;

  @Column({ name: 'endereco', type: 'text', nullable: true })
  endereco?: string;

  @Column({ name: 'telefone', type: 'varchar', length: 20, nullable: true })
  telefone?: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email?: string;

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
  @ManyToOne(() => Empresa, (empresa) => empresa.funcionarios)
  @JoinColumn({ name: 'empresa_id' })
  empresa!: Empresa;

  @ManyToOne(() => UsuarioEmpresa, (usuarioEmpresa) => usuarioEmpresa.funcionarios)
  @JoinColumn({ name: 'usuario_empresa_id' })
  usuarioEmpresa?: UsuarioEmpresa;

  @OneToMany(() => FuncionarioContrato, (contrato) => contrato.funcionario)
  contratos!: FuncionarioContrato[];

  @OneToMany(() => TarefaTipo, (tarefaTipo) => tarefaTipo.gerenteFuncionario)
  tarefaTiposGerenciados!: TarefaTipo[];

  @OneToMany(() => TarefaFuncionarioStatus, (status) => status.funcionario)
  tarefaStatus!: TarefaFuncionarioStatus[];

  @OneToMany(() => Emprestimo, (emprestimo) => emprestimo.funcionario)
  emprestimos!: Emprestimo[];
}

