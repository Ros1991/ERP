import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseRequest } from './PurchaseRequest';
import { PurchaseItem } from './PurchaseItem';
import { User } from './User';

export enum PurchaseAttachmentType {
  ESPECIFICACAO = 'Especificacao',
  ORCAMENTO = 'Orcamento',
  NOTA_FISCAL = 'Nota_Fiscal',
  FOTO_NECESSIDADE = 'Foto_Necessidade',
  MANUAL = 'Manual',
  OUTROS = 'Outros'
}

@Entity('purchase_attachments')
export class PurchaseAttachment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  purchase_request_id!: string;

  @Column({ type: 'uuid', nullable: true })
  purchase_item_id: string | null;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 500 })
  file_url!: string;

  @Column({ type: 'varchar', length: 255 })
  file_name!: string;

  @Column({ type: 'varchar', length: 100 })
  file_type!: string;

  @Column({ type: 'enum', enum: PurchaseAttachmentType })
  attachment_type: PurchaseAttachmentType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @CreateDateColumn()
  uploaded_at!: Date;

  // Relationships
  @ManyToOne(() => PurchaseRequest, request => request.attachments)
  @JoinColumn({ name: 'purchase_request_id' })
  purchase_request: PurchaseRequest;

  @ManyToOne(() => PurchaseItem, { nullable: true })
  @JoinColumn({ name: 'purchase_item_id' })
  purchase_item: PurchaseItem | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}

