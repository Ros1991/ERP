import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Check } from 'typeorm';
import { BaseEntity } from '@/core/base/BaseEntity';
import { Tarefa } from '@/entities/Tarefa';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';

@Entity('tarefa_historia')
@Check(`"tipo_evento" IN ('COMENTARIO', 'ANEXO', 'ATRIBUICAO', 'ALTERACAO_DADOS', 'OBSERVACAO_GERENCIAL')`)
export class TarefaHistoria extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'historia_id' })
  historiaId!: number;

  @Column({ name: 'tarefa_id', type: 'bigint' })
  tarefaId!: number;

  @Column({ name: 'usuario_empresa_id', type: 'bigint' })
  usuarioEmpresaId!: number;

  @Column({ name: 'tipo_evento', type: 'varchar', length: 30 })
  tipoEvento!: 'COMENTARIO' | 'ANEXO' | 'ATRIBUICAO' | 'ALTERACAO_DADOS' | 'OBSERVACAO_GERENCIAL';

  @Column({ name: 'comentario', type: 'text', nullable: true })
  comentario?: string;

  @Column({ name: 'arquivo_url', type: 'varchar', length: 500, nullable: true })
  arquivoUrl?: string;

  @Column({ name: 'dados_alterados', type: 'jsonb', nullable: true })
  dadosAlterados?: any;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  // Relationships
  @ManyToOne(() => Tarefa, (tarefa) => tarefa.historias)
  @JoinColumn({ name: 'tarefa_id' })
  tarefa!: Tarefa;

  @ManyToOne(() => UsuarioEmpresa, (usuarioEmpresa) => usuarioEmpresa.tarefaHistorias)
  @JoinColumn({ name: 'usuario_empresa_id' })
  usuarioEmpresa!: UsuarioEmpresa;
}

