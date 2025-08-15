import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, BaseEntity as TypeOrmBaseEntity } from 'typeorm';
import { User } from '@/entities/User';

@Entity('jwt_token')
export class JwtToken extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'token_id' })
  tokenId!: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: number;

  @Column({ name: 'token_hash', type: 'varchar', length: 255 })
  tokenHash!: string;

  @Column({ name: 'expiration_date', type: 'timestamp' })
  expirationDate!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}

