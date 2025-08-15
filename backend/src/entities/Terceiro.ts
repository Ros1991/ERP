import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Check } from 'typeorm';
import { SoftDeleteBaseEntity } from '@/core/base/BaseEntity';
import { Empresa } from '@/entities/Empresa';
import { TransacaoFinanceira } from '@/entities/TransacaoFinanceira';
import { PedidoCompra } from '@/entities/PedidoCompra';

@Entity('terceiro')
@Check(`"tipo" IN ('CLIENTE', 'FORNECEDOR', 'AMBOS')`)
export class Terceiro extends SoftDeleteBaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'terceiro_id' })
  terceiroId!: number;

  @Column({ name: 'empresa_id', type: 'bigint' })
  empresaId!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'tipo', type: 'varchar', length: 20 })
  tipo!: 'CLIENTE' | 'FORNECEDOR' | 'AMBOS';

  @Column({ name: 'cnpj_cpf', type: 'varchar', length: 18, nullable: true })
  cnpjCpf?: string;

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
  @ManyToOne(() => Empresa, (empresa) => empresa.terceiros)
  @JoinColumn({ name: 'empresa_id' })
  empresa!: Empresa;

  @OneToMany(() => TransacaoFinanceira, (transacao) => transacao.terceiro)
  transacoes!: TransacaoFinanceira[];

  @OneToMany(() => PedidoCompra, (pedido) => pedido.terceiro)
  pedidosCompra!: PedidoCompra[];
}

