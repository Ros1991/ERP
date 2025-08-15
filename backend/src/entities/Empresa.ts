import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { SoftDeleteBaseEntity } from '@/core/base/BaseEntity';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';
import { Role } from '@/entities/Role';
import { Funcionario } from '@/entities/Funcionario';
import { TarefaTipo } from '@/entities/TarefaTipo';
import { Tarefa } from '@/entities/Tarefa';
import { Conta } from '@/entities/Conta';
import { CentroCusto } from '@/entities/CentroCusto';
import { Terceiro } from '@/entities/Terceiro';
import { TransacaoFinanceira } from '@/entities/TransacaoFinanceira';
import { Emprestimo } from '@/entities/Emprestimo';
import { PedidoCompra } from '@/entities/PedidoCompra';

@Entity('empresa')
export class Empresa extends SoftDeleteBaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'empresa_id' })
  empresaId!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'cnpj', type: 'varchar', length: 18, unique: true, nullable: true })
  cnpj?: string;

  @Column({ name: 'razao_social', type: 'varchar', length: 255, nullable: true })
  razaoSocial?: string;

  @Column({ name: 'ativa', type: 'boolean', default: true })
  ativa!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  // Relationships
  @OneToMany(() => UsuarioEmpresa, (usuarioEmpresa) => usuarioEmpresa.empresa)
  usuarioEmpresas!: UsuarioEmpresa[];

  @OneToMany(() => Role, (role) => role.empresa)
  roles!: Role[];

  @OneToMany(() => Funcionario, (funcionario) => funcionario.empresa)
  funcionarios!: Funcionario[];

  @OneToMany(() => TarefaTipo, (tarefaTipo) => tarefaTipo.empresa)
  tarefaTipos!: TarefaTipo[];

  @OneToMany(() => Tarefa, (tarefa) => tarefa.empresa)
  tarefas!: Tarefa[];

  @OneToMany(() => Conta, (conta) => conta.empresa)
  contas!: Conta[];

  @OneToMany(() => CentroCusto, (centroCusto) => centroCusto.empresa)
  centrosCusto!: CentroCusto[];

  @OneToMany(() => Terceiro, (terceiro) => terceiro.empresa)
  terceiros!: Terceiro[];

  @OneToMany(() => TransacaoFinanceira, (transacao) => transacao.empresa)
  transacoesFinanceiras!: TransacaoFinanceira[];

  @OneToMany(() => Emprestimo, (emprestimo) => emprestimo.empresa)
  emprestimos!: Emprestimo[];

  @OneToMany(() => PedidoCompra, (pedido) => pedido.empresa)
  pedidosCompra!: PedidoCompra[];
}

