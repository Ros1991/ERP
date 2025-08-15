import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { SoftDeleteBaseEntity } from '@/core/base/BaseEntity';
import { Empresa } from '@/entities/Empresa';
import { TarefaTipo } from '@/entities/TarefaTipo';
import { TransacaoCentroCusto } from '@/entities/TransacaoCentroCusto';
import { PedidoCompra } from '@/entities/PedidoCompra';

@Entity('centro_custo')
export class CentroCusto extends SoftDeleteBaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'centro_custo_id' })
  centroCustoId!: number;

  @Column({ name: 'empresa_id', type: 'bigint' })
  empresaId!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao?: string;

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
  @ManyToOne(() => Empresa, (empresa) => empresa.centrosCusto)
  @JoinColumn({ name: 'empresa_id' })
  empresa!: Empresa;

  @OneToMany(() => TarefaTipo, (tarefaTipo) => tarefaTipo.centroCusto)
  tarefaTipos!: TarefaTipo[];

  @OneToMany(() => TransacaoCentroCusto, (transacaoCentroCusto) => transacaoCentroCusto.centroCusto)
  transacoesCentroCusto!: TransacaoCentroCusto[];

  @OneToMany(() => PedidoCompra, (pedido) => pedido.centroCusto)
  pedidosCompra!: PedidoCompra[];
}

