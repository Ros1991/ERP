import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Unique, Check } from 'typeorm';
import { BaseEntity } from '@/core/base/BaseEntity';
import { Tarefa } from '@/entities/Tarefa';
import { Funcionario } from '@/entities/Funcionario';
import { TarefaFuncionarioStatusHistoria } from '@/entities/TarefaFuncionarioStatusHistoria';

@Entity('tarefa_funcionario_status')
@Unique(['tarefaId', 'funcionarioId'])
@Check(`"status" IN ('ATRIBUIDA', 'EM_ANDAMENTO', 'PAUSADA', 'PARADA', 'CONCLUIDA', 'CANCELADA')`)
export class TarefaFuncionarioStatus extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'status_id' })
  statusId!: number;

  @Column({ name: 'tarefa_id', type: 'bigint' })
  tarefaId!: number;

  @Column({ name: 'funcionario_id', type: 'bigint' })
  funcionarioId!: number;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'ATRIBUIDA' })
  status!: 'ATRIBUIDA' | 'EM_ANDAMENTO' | 'PAUSADA' | 'PARADA' | 'CONCLUIDA' | 'CANCELADA';

  @Column({ name: 'tempo_gasto_minutos', type: 'integer', default: 0 })
  tempoGastoMinutos!: number;

  @Column({ name: 'data_atribuicao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataAtribuicao!: Date;

  @Column({ name: 'data_inicio', type: 'timestamp', nullable: true })
  dataInicio?: Date;

  @Column({ name: 'data_conclusao', type: 'timestamp', nullable: true })
  dataConclusao?: Date;

  @Column({ name: 'observacoes_funcionario', type: 'text', nullable: true })
  observacoesFuncionario?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => Tarefa, (tarefa) => tarefa.funcionarioStatus)
  @JoinColumn({ name: 'tarefa_id' })
  tarefa!: Tarefa;

  @ManyToOne(() => Funcionario, (funcionario) => funcionario.tarefaStatus)
  @JoinColumn({ name: 'funcionario_id' })
  funcionario!: Funcionario;

  @OneToMany(() => TarefaFuncionarioStatusHistoria, (historia) => historia.status)
  historias!: TarefaFuncionarioStatusHistoria[];
}

