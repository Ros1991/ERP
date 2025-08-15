import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '@/core/base/BaseEntity';
import { TarefaFuncionarioStatus } from '@/entities/TarefaFuncionarioStatus';

@Entity('tarefa_funcionario_status_historia')
export class TarefaFuncionarioStatusHistoria extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'historia_status_id' })
  historiaStatusId!: number;

  @Column({ name: 'status_id', type: 'bigint' })
  statusId!: number;

  @Column({ name: 'status_anterior', type: 'varchar', length: 20, nullable: true })
  statusAnterior?: string;

  @Column({ name: 'status_novo', type: 'varchar', length: 20, nullable: true })
  statusNovo?: string;

  @Column({ name: 'tempo_sessao_minutos', type: 'integer', nullable: true })
  tempoSessaoMinutos?: number;

  @Column({ name: 'motivo', type: 'text', nullable: true })
  motivo?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  // Relationships
  @ManyToOne(() => TarefaFuncionarioStatus, (status) => status.historias)
  @JoinColumn({ name: 'status_id' })
  status!: TarefaFuncionarioStatus;
}

