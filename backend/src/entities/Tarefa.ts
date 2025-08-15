import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Check } from 'typeorm';
import { SoftDeleteBaseEntity } from '@/core/base/BaseEntity';
import { Empresa } from '@/entities/Empresa';
import { TarefaTipo } from '@/entities/TarefaTipo';
import { TarefaFuncionarioStatus } from '@/entities/TarefaFuncionarioStatus';
import { TarefaHistoria } from '@/entities/TarefaHistoria';

@Entity('tarefa')
@Check(`"status" IN ('PENDENTE', 'EM_ANDAMENTO', 'PAUSADA', 'PARADA', 'CONCLUIDA', 'CANCELADA')`)
@Check(`"prioridade" IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE')`)
export class Tarefa extends SoftDeleteBaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'tarefa_id' })
  tarefaId!: number;

  @Column({ name: 'empresa_id', type: 'bigint' })
  empresaId!: number;

  @Column({ name: 'tipo_id', type: 'bigint', nullable: true })
  tipoId?: number;

  @Column({ name: 'titulo', type: 'varchar', length: 255 })
  titulo!: string;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao?: string;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'PENDENTE' })
  status!: 'PENDENTE' | 'EM_ANDAMENTO' | 'PAUSADA' | 'PARADA' | 'CONCLUIDA' | 'CANCELADA';

  @Column({ name: 'prioridade', type: 'varchar', length: 20, default: 'MEDIA' })
  prioridade!: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';

  @Column({ name: 'data_inicio', type: 'date', nullable: true })
  dataInicio?: Date;

  @Column({ name: 'data_prazo', type: 'date', nullable: true })
  dataPrazo?: Date;

  @Column({ name: 'data_conclusao', type: 'date', nullable: true })
  dataConclusao?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  // Relationships
  @ManyToOne(() => Empresa, (empresa) => empresa.tarefas)
  @JoinColumn({ name: 'empresa_id' })
  empresa!: Empresa;

  @ManyToOne(() => TarefaTipo, (tipo) => tipo.tarefas)
  @JoinColumn({ name: 'tipo_id' })
  tipo?: TarefaTipo;

  @OneToMany(() => TarefaFuncionarioStatus, (status) => status.tarefa)
  funcionarioStatus!: TarefaFuncionarioStatus[];

  @OneToMany(() => TarefaHistoria, (historia) => historia.tarefa)
  historias!: TarefaHistoria[];
}

