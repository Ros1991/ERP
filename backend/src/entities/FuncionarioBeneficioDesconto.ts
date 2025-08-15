import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Check } from 'typeorm';
import { BaseEntity } from '@/core/base/BaseEntity';
import { FuncionarioContrato } from '@/entities/FuncionarioContrato';

@Entity('funcionario_beneficio_desconto')
@Check(`"tipo" IN ('BENEFICIO', 'DESCONTO')`)
@Check(`"frequencia" IN ('MENSAL', 'ANUAL', 'UMA_VEZ', 'FERIAS', '13_SALARIO')`)
export class FuncionarioBeneficioDesconto extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'beneficio_desconto_id' })
  beneficioDescontoId!: number;

  @Column({ name: 'contrato_id', type: 'bigint' })
  contratoId!: number;

  @Column({ name: 'tipo', type: 'varchar', length: 20 })
  tipo!: 'BENEFICIO' | 'DESCONTO';

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2 })
  valor!: number;

  @Column({ name: 'frequencia', type: 'varchar', length: 20 })
  frequencia!: 'MENSAL' | 'ANUAL' | 'UMA_VEZ' | 'FERIAS' | '13_SALARIO';

  @Column({ name: 'data_inicio', type: 'date' })
  dataInicio!: Date;

  @Column({ name: 'data_fim', type: 'date', nullable: true })
  dataFim?: Date;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => FuncionarioContrato, (contrato) => contrato.beneficiosDescontos)
  @JoinColumn({ name: 'contrato_id' })
  contrato!: FuncionarioContrato;
}

