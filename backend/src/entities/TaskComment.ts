import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Task } from './Task';
import { User } from './User';

export enum CommentType {
  GERAL = 'Geral',
  PROBLEMA = 'Problema',
  SOLUCAO = 'Solucao',
  APROVACAO = 'Aprovacao',
  REJEICAO = 'Rejeicao'
}

@Entity('task_comments')
export class TaskComment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  task_id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'text' })
  comment!: string;

  @Column({ type: 'enum', enum: CommentType, default: CommentType.GERAL })
  comment_type: CommentType;

  @Column({ type: 'uuid', nullable: true })
  parent_comment_id: string | null;

  @Column({ type: 'boolean', default: false })
  is_internal!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => Task, task => task.comments)
  @JoinColumn({ name: 'task_id' })
  task!: Task;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => TaskComment, { nullable: true })
  @JoinColumn({ name: 'parent_comment_id' })
  parent_comment: TaskComment | null;

  @OneToMany(() => TaskComment, comment => comment.parent_comment)
  replies!: any[];
}

