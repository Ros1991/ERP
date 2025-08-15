import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseRequest } from './PurchaseRequest';
import { User } from './User';
import { Employee } from './Employee';

export enum PurchaseCommentType {
  GERAL = 'Geral',
  PERGUNTA = 'Pergunta',
  RESPOSTA = 'Resposta',
  APROVACAO = 'Aprovacao',
  REJEICAO = 'Rejeicao',
  ATUALIZACAO_STATUS = 'Atualizacao_Status'
}

@Entity('purchase_comments')
export class PurchaseComment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  purchase_request_id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  employee_id: string | null;

  @Column({ type: 'text' })
  comment!: string;

  @Column({ type: 'enum', enum: PurchaseCommentType, default: PurchaseCommentType.GERAL })
  comment_type: PurchaseCommentType;

  @Column({ type: 'boolean', default: false })
  is_internal!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => PurchaseRequest, request => request.comments)
  @JoinColumn({ name: 'purchase_request_id' })
  purchase_request: PurchaseRequest;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee | null;
}

