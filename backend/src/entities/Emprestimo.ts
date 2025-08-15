import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Check } from 'typeorm';
import { BaseEntity } from '@/core/base/BaseEntity';
import { Empresa } from '@/entities/Empresa';
import { Funcionario } from '@/entities/Funcionario';

@Entity('emprestimo')
@Check(`"quando_cobrar" IN ('MENSAL', 'FERIAS', '13_SALARIO', 'TUDO')`)
@Check(`"status" IN ('ATIVO', 'QUITADO', 'CANCELADO')`)
export class Emprestimo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'emprestimo_id' })
  emprestimoId!: number;

  @Column({ name: 'empresa_id', type: 'bigint' })
  empresaId!: number;

  @Column({ name: 'funcionario_id', type: 'bigint' })
  funcionarioId!: number;

  @Column({ name: 'valor_total', type: 'decimal', precision: 10, scale: 2 })
  valorTotal!: number;

  @Column({ name: 'valor_pago', type: 'decimal', precision: 10, scale: 2, default: 0 })
  valorPago!: number;

  @Column({ name: 'valor_pendente', type: 'decimal', precision: 10, scale: 2 })
  valorPendente!: number;

  @Column({ name: 'total_parcelas', type: 'integer' })
  totalParcelas!: number;

  @Column({ name: 'parcelas_pagas', type: 'integer', default: 0 })
  parcelasPagas!: number;

  @Column({ name: 'quando_cobrar', type: 'varchar', length: 20 })
  quandoCobrar!: 'MENSAL' | 'FERIAS' | '13_SALARIO' | 'TUDO';

  @Column({ name: 'data_emprestimo', type: 'date' })
  dataEmprestimo!: Date;

  @Column({ name: 'data_inicio_cobranca', type: 'date' })
  dataInicioCobranca!: Date;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'ATIVO' })
  status!: 'ATIVO' | 'QUITADO' | 'CANCELADO';

  @Column({ name: 'observacoes', type: 'text', nullable: true })
  observacoes?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => Empresa, (empresa) => empresa.emprestimos)
  @JoinColumn({ name: 'empresa_id' })
  empresa!: Empresa;

  @ManyToOne(() => Funcionario, (funcionario) => funcionario.emprestimos)
  @JoinColumn({ name: 'funcionario_id' })
  funcionario!: Funcionario;
}

