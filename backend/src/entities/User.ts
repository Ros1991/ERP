import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { SoftDeleteBaseEntity } from '@/core/base/BaseEntity';
import { JwtToken } from '@/entities/JwtToken';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';

@Entity('user')
export class User extends SoftDeleteBaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'user_id' })
  userId!: number;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  // Alias for password_hash to match service expectations
  get password(): string {
    return this.passwordHash;
  }
  set password(value: string) {
    this.passwordHash = value;
  }

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  @Column({ name: 'reset_token_hash', type: 'varchar', length: 255, nullable: true })
  resetTokenHash?: string;

  @Column({ name: 'reset_token_expires', type: 'timestamp', nullable: true })
  resetTokenExpires?: Date;

  // Relationships
  @OneToMany(() => JwtToken, (token) => token.user)
  tokens!: JwtToken[];

  @OneToMany(() => UsuarioEmpresa, (usuarioEmpresa) => usuarioEmpresa.user)
  usuarioEmpresas!: UsuarioEmpresa[];
}

