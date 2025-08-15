import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Check } from 'typeorm';
import { SoftDeleteBaseEntity } from '@/core/base/BaseEntity';
import { Funcionario } from '@/entities/Funcionario';
import { FuncionarioBeneficioDesconto } from '@/entities/FuncionarioBeneficioDesconto';

@Entity('funcionario_contrato')
@Check(`"tipo_contrato" IN ('CLT', 'PJ', 'ESTAGIARIO', 'TERCEIRIZADO')`)
@Check(`"tipo_pagamento" IN ('HORISTA', 'DIARISTA', 'MENSALISTA')`)
export class FuncionarioContrato extends SoftDeleteBaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'contrato_id' })
  contratoId!: number;

  @Column({ name: 'funcionario_id', type: 'bigint' })
  funcionarioId!: number;

  @Column({ name: 'tipo_contrato', type: 'varchar', length: 20 })
  tipoContrato!: 'CLT' | 'PJ' | 'ESTAGIARIO' | 'TERCEIRIZADO';

  @Column({ name: 'tipo_pagamento', type: 'varchar', length: 20 })
  tipoPagamento!: 'HORISTA' | 'DIARISTA' | 'MENSALISTA';

  @Column({ name: 'forma_pagamento', type: 'text', nullable: true })
  formaPagamento?: string;

  @Column({ name: 'salario', type: 'decimal', precision: 10, scale: 2 })
  salario!: number;

  @Column({ name: 'carga_horaria_semanal', type: 'integer', nullable: true })
  cargaHorariaSemanal?: number;

  @Column({ name: 'data_inicio', type: 'date' })
  dataInicio!: Date;

  @Column({ name: 'data_fim', type: 'date', nullable: true })
  dataFim?: Date;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

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
  @ManyToOne(() => Funcionario, (funcionario) => funcionario.contratos)
  @JoinColumn({ name: 'funcionario_id' })
  funcionario!: Funcionario;

  @OneToMany(() => FuncionarioBeneficioDesconto, (beneficioDesconto) => beneficioDesconto.contrato)
  beneficiosDescontos!: FuncionarioBeneficioDesconto[];
}

