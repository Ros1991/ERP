import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Check } from 'typeorm';
import { BaseEntity } from '@/core/base/BaseEntity';
import { Empresa } from '@/entities/Empresa';
import { Terceiro } from '@/entities/Terceiro';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';
import { CentroCusto } from '@/entities/CentroCusto';

@Entity('pedido_compra')
@Check(`"status" IN ('PENDENTE', 'APROVADO', 'COMPRADO', 'CANCELADO')`)
export class PedidoCompra extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'pedido_id' })
  pedidoId!: number;

  @Column({ name: 'empresa_id', type: 'bigint' })
  empresaId!: number;

  @Column({ name: 'terceiro_id', type: 'bigint', nullable: true })
  terceiroId?: number;

  @Column({ name: 'usuario_empresa_solicitante_id', type: 'bigint' })
  usuarioEmpresaSolicitanteId!: number;

  @Column({ name: 'centro_custo_id', type: 'bigint', nullable: true })
  centroCustoId?: number;

  @Column({ name: 'descricao', type: 'text' })
  descricao!: string;

  @Column({ name: 'valor_estimado', type: 'decimal', precision: 15, scale: 2, nullable: true })
  valorEstimado?: number;

  @Column({ name: 'data_solicitacao', type: 'date' })
  dataSolicitacao!: Date;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'PENDENTE' })
  status!: 'PENDENTE' | 'APROVADO' | 'COMPRADO' | 'CANCELADO';

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => Empresa, (empresa) => empresa.pedidosCompra)
  @JoinColumn({ name: 'empresa_id' })
  empresa!: Empresa;

  @ManyToOne(() => Terceiro, (terceiro) => terceiro.pedidosCompra)
  @JoinColumn({ name: 'terceiro_id' })
  terceiro?: Terceiro;

  @ManyToOne(() => UsuarioEmpresa, (usuarioEmpresa) => usuarioEmpresa.pedidosCompraSolicitados)
  @JoinColumn({ name: 'usuario_empresa_solicitante_id' })
  usuarioEmpresaSolicitante!: UsuarioEmpresa;

  @ManyToOne(() => CentroCusto, (centroCusto) => centroCusto.pedidosCompra)
  @JoinColumn({ name: 'centro_custo_id' })
  centroCusto?: CentroCusto;
}

