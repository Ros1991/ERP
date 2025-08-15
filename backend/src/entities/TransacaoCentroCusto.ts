import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { BaseEntity } from '@/core/base/BaseEntity';
import { TransacaoFinanceira } from '@/entities/TransacaoFinanceira';
import { CentroCusto } from '@/entities/CentroCusto';

@Entity('transacao_centro_custo')
@Unique(['transacaoId', 'centroCustoId'])
export class TransacaoCentroCusto extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'transacao_centro_custo_id' })
  transacaoCentroCustoId!: number;

  @Column({ name: 'transacao_id', type: 'bigint' })
  transacaoId!: number;

  @Column({ name: 'centro_custo_id', type: 'bigint' })
  centroCustoId!: number;

  @Column({ name: 'percentual', type: 'decimal', precision: 5, scale: 2 })
  percentual!: number;

  @Column({ name: 'valor', type: 'decimal', precision: 15, scale: 2 })
  valor!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  // Relationships
  @ManyToOne(() => TransacaoFinanceira, (transacao) => transacao.centrosCusto)
  @JoinColumn({ name: 'transacao_id' })
  transacao!: TransacaoFinanceira;

  @ManyToOne(() => CentroCusto, (centroCusto) => centroCusto.transacoesCentroCusto)
  @JoinColumn({ name: 'centro_custo_id' })
  centroCusto!: CentroCusto;
}

