import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from './Task';
import { User } from './User';

export enum AttachmentType {
  INSTRUCAO = 'Instrucao',
  REFERENCIA = 'Referencia',
  RESULTADO = 'Resultado',
  PROBLEMA = 'Problema',
  OUTROS = 'Outros'
}

@Entity('task_attachments')
export class TaskAttachment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  task_id!: string;

  @Column({ type: 'uuid' })
  uploaded_by_user_id!: string;

  @Column({ type: 'varchar', length: 500 })
  file_url!: string;

  @Column({ type: 'varchar', length: 255 })
  file_name!: string;

  @Column({ type: 'varchar', length: 100 })
  file_type!: string;

  @Column({ type: 'enum', enum: AttachmentType })
  attachment_type: AttachmentType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @CreateDateColumn()
  uploaded_at!: Date;

  // Relationships
  @ManyToOne(() => Task, task => task.attachments)
  @JoinColumn({ name: 'task_id' })
  task!: Task;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploaded_by!: User;
}

