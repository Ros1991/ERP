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

export enum ItemStatus {
  PENDENTE = 'Pendente',
  COTADO = 'Cotado',
  COMPRADO = 'Comprado',
  ENTREGUE = 'Entregue',
  CANCELADO = 'Cancelado'
}

@Entity('purchase_items')
export class PurchaseItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  purchase_request_id!: string;

  @Column({ type: 'varchar', length: 255 })
  item_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  brand_preference: string | null;

  @Column({ type: 'text', nullable: true })
  specifications: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  quantity!: number;

  @Column({ type: 'varchar', length: 50 })
  unit!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimated_unit_price: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimated_total_price: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  actual_unit_price: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  actual_total_price: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  supplier: string | null;

  @Column({ type: 'enum', enum: ItemStatus, default: ItemStatus.PENDENTE })
  item_status: ItemStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => PurchaseRequest, request => request.items)
  @JoinColumn({ name: 'purchase_request_id' })
  purchase_request: PurchaseRequest;
}

