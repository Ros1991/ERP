import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Check } from 'typeorm';
import { SoftDeleteBaseEntity } from '@/core/base/BaseEntity';
import { Empresa } from '@/entities/Empresa';
import { TransacaoFinanceira } from '@/entities/TransacaoFinanceira';

@Entity('conta')
@Check(`"tipo" IN ('SOCIO', 'EMPRESA', 'BANCO', 'CAIXA')`)
export class Conta extends SoftDeleteBaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'conta_id' })
  contaId!: number;

  @Column({ name: 'empresa_id', type: 'bigint' })
  empresaId!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'tipo', type: 'varchar', length: 20 })
  tipo!: 'SOCIO' | 'EMPRESA' | 'BANCO' | 'CAIXA';

  @Column({ name: 'saldo_inicial', type: 'decimal', precision: 15, scale: 2, default: 0 })
  saldoInicial!: number;

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
  @ManyToOne(() => Empresa, (empresa) => empresa.contas)
  @JoinColumn({ name: 'empresa_id' })
  empresa!: Empresa;

  @OneToMany(() => TransacaoFinanceira, (transacao) => transacao.conta)
  transacoes!: TransacaoFinanceira[];
}

