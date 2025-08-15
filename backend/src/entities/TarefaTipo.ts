import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '@/core/base/BaseEntity';
import { Empresa } from '@/entities/Empresa';
import { Funcionario } from '@/entities/Funcionario';
import { CentroCusto } from '@/entities/CentroCusto';
import { Tarefa } from '@/entities/Tarefa';

@Entity('tarefa_tipo')
export class TarefaTipo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'tipo_id' })
  tipoId!: number;

  @Column({ name: 'empresa_id', type: 'bigint' })
  empresaId!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'gerente_funcionario_id', type: 'bigint', nullable: true })
  gerenteFuncionarioId?: number;

  @Column({ name: 'centro_custo_id', type: 'bigint', nullable: true })
  centroCustoId?: number;

  @Column({ name: 'cor', type: 'varchar', length: 7, nullable: true })
  cor?: string;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => Empresa, (empresa) => empresa.tarefaTipos)
  @JoinColumn({ name: 'empresa_id' })
  empresa!: Empresa;

  @ManyToOne(() => Funcionario, (funcionario) => funcionario.tarefaTiposGerenciados)
  @JoinColumn({ name: 'gerente_funcionario_id' })
  gerenteFuncionario?: Funcionario;

  @ManyToOne(() => CentroCusto, (centroCusto) => centroCusto.tarefaTipos)
  @JoinColumn({ name: 'centro_custo_id' })
  centroCusto?: CentroCusto;

  @OneToMany(() => Tarefa, (tarefa) => tarefa.tipo)
  tarefas!: Tarefa[];
}

