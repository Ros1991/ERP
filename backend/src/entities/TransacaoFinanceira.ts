import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Check } from 'typeorm';
import { SoftDeleteBaseEntity } from '@/core/base/BaseEntity';
import { Empresa } from '@/entities/Empresa';
import { Conta } from '@/entities/Conta';
import { Terceiro } from '@/entities/Terceiro';
import { TransacaoCentroCusto } from '@/entities/TransacaoCentroCusto';

@Entity('transacao_financeira')
@Check(`"tipo" IN ('RECEITA', 'DESPESA')`)
@Check(`"status" IN ('PENDENTE', 'PAGO', 'CANCELADO')`)
export class TransacaoFinanceira extends SoftDeleteBaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'transacao_id' })
  transacaoId!: number;

  @Column({ name: 'empresa_id', type: 'bigint' })
  empresaId!: number;

  @Column({ name: 'tipo', type: 'varchar', length: 20 })
  tipo!: 'RECEITA' | 'DESPESA';

  @Column({ name: 'conta_id', type: 'bigint' })
  contaId!: number;

  @Column({ name: 'terceiro_id', type: 'bigint', nullable: true })
  terceiroId?: number;

  @Column({ name: 'descricao', type: 'varchar', length: 255 })
  descricao!: string;

  @Column({ name: 'valor', type: 'decimal', precision: 15, scale: 2 })
  valor!: number;

  @Column({ name: 'data_transacao', type: 'date' })
  dataTransacao!: Date;

  @Column({ name: 'data_vencimento', type: 'date', nullable: true })
  dataVencimento?: Date;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'PENDENTE' })
  status!: 'PENDENTE' | 'PAGO' | 'CANCELADO';

  @Column({ name: 'observacoes', type: 'text', nullable: true })
  observacoes?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  // Relationships
  @ManyToOne(() => Empresa, (empresa) => empresa.transacoesFinanceiras)
  @JoinColumn({ name: 'empresa_id' })
  empresa!: Empresa;

  @ManyToOne(() => Conta, (conta) => conta.transacoes)
  @JoinColumn({ name: 'conta_id' })
  conta!: Conta;

  @ManyToOne(() => Terceiro, (terceiro) => terceiro.transacoes)
  @JoinColumn({ name: 'terceiro_id' })
  terceiro?: Terceiro;

  @OneToMany(() => TransacaoCentroCusto, (transacaoCentroCusto) => transacaoCentroCusto.transacao)
  centrosCusto!: TransacaoCentroCusto[];
}

