import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1692000000000 implements MigrationInterface {
  name = 'InitialMigration1692000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create function for updating updated_at column
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Tabela de Usuários
    await queryRunner.query(`
      CREATE TABLE "user" (
          user_id BIGSERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          nome VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL,
          is_deleted BOOLEAN DEFAULT FALSE
      );
    `);

    // Tabela de Tokens JWT
    await queryRunner.query(`
      CREATE TABLE jwt_token (
          token_id BIGSERIAL PRIMARY KEY,
          user_id BIGINT NOT NULL,
          token_hash VARCHAR(255) NOT NULL,
          expiration_date TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES "user"(user_id)
      );
    `);

    // Tabela de Empresas
    await queryRunner.query(`
      CREATE TABLE empresa (
          empresa_id BIGSERIAL PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          cnpj VARCHAR(18) UNIQUE,
          razao_social VARCHAR(255),
          ativa BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL,
          is_deleted BOOLEAN DEFAULT FALSE
      );
    `);

    // Relacionamento Usuario-Empresa
    await queryRunner.query(`
      CREATE TABLE usuario_empresa (
          usuario_empresa_id BIGSERIAL PRIMARY KEY,
          user_id BIGINT NOT NULL,
          empresa_id BIGINT NOT NULL,
          role_id BIGINT,
          ativo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES "user"(user_id),
          FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id),
          UNIQUE (user_id, empresa_id)
      );
    `);

    // Tabela de Roles/Papéis
    await queryRunner.query(`
      CREATE TABLE role (
          role_id BIGSERIAL PRIMARY KEY,
          empresa_id BIGINT NOT NULL,
          nome VARCHAR(100) NOT NULL,
          permissoes JSONB,
          ativo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL,
          is_deleted BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id),
          UNIQUE (empresa_id, nome)
      );
    `);

    // Adicionar FK para role na usuario_empresa
    await queryRunner.query(`
      ALTER TABLE usuario_empresa 
      ADD CONSTRAINT fk_usuario_empresa_role 
      FOREIGN KEY (role_id) REFERENCES role(role_id);
    `);

    // Tabela de Funcionários
    await queryRunner.query(`
      CREATE TABLE funcionario (
          funcionario_id BIGSERIAL PRIMARY KEY,
          empresa_id BIGINT NOT NULL,
          usuario_empresa_id BIGINT NULL,
          nome VARCHAR(255),
          apelido VARCHAR(255) NOT NULL,
          cpf VARCHAR(14) UNIQUE,
          rg VARCHAR(20),
          data_nascimento DATE,
          endereco TEXT,
          telefone VARCHAR(20),
          email VARCHAR(255),
          ativo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL,
          is_deleted BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id),
          FOREIGN KEY (usuario_empresa_id) REFERENCES usuario_empresa(usuario_empresa_id),
          UNIQUE (empresa_id, apelido)
      );
    `);

    // Tabela de Contratos de Funcionários
    await queryRunner.query(`
      CREATE TABLE funcionario_contrato (
          contrato_id BIGSERIAL PRIMARY KEY,
          funcionario_id BIGINT NOT NULL,
          tipo_contrato VARCHAR(20) NOT NULL CHECK (tipo_contrato IN ('CLT', 'PJ', 'ESTAGIARIO', 'TERCEIRIZADO')),
          tipo_pagamento VARCHAR(20) NOT NULL CHECK (tipo_pagamento IN ('HORISTA', 'DIARISTA', 'MENSALISTA')),
          forma_pagamento TEXT,
          salario DECIMAL(10,2) NOT NULL,
          carga_horaria_semanal INTEGER,
          data_inicio DATE NOT NULL,
          data_fim DATE NULL,
          ativo BOOLEAN DEFAULT TRUE,
          observacoes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL,
          is_deleted BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (funcionario_id) REFERENCES funcionario(funcionario_id)
      );
    `);

    // Tabela de Benefícios e Descontos
    await queryRunner.query(`
      CREATE TABLE funcionario_beneficio_desconto (
          beneficio_desconto_id BIGSERIAL PRIMARY KEY,
          contrato_id BIGINT NOT NULL,
          tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('BENEFICIO', 'DESCONTO')),
          nome VARCHAR(255) NOT NULL,
          valor DECIMAL(10,2) NOT NULL,
          frequencia VARCHAR(20) NOT NULL CHECK (frequencia IN ('MENSAL', 'ANUAL', 'UMA_VEZ', 'FERIAS', '13_SALARIO')),
          data_inicio DATE NOT NULL,
          data_fim DATE NULL,
          ativo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (contrato_id) REFERENCES funcionario_contrato(contrato_id)
      );
    `);

    // Tipos de Tarefa
    await queryRunner.query(`
      CREATE TABLE tarefa_tipo (
          tipo_id BIGSERIAL PRIMARY KEY,
          empresa_id BIGINT NOT NULL,
          nome VARCHAR(255) NOT NULL,
          gerente_funcionario_id BIGINT NULL,
          centro_custo_id BIGINT NULL,
          cor VARCHAR(7),
          ativo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id),
          FOREIGN KEY (gerente_funcionario_id) REFERENCES funcionario(funcionario_id)
      );
    `);

    // Tabela de Tarefas
    await queryRunner.query(`
      CREATE TABLE tarefa (
          tarefa_id BIGSERIAL PRIMARY KEY,
          empresa_id BIGINT NOT NULL,
          tipo_id BIGINT NULL,
          titulo VARCHAR(255) NOT NULL,
          descricao TEXT,
          status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'EM_ANDAMENTO', 'PAUSADA', 'PARADA', 'CONCLUIDA', 'CANCELADA')),
          prioridade VARCHAR(20) DEFAULT 'MEDIA' CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE')),
          data_inicio DATE,
          data_prazo DATE,
          data_conclusao DATE NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL,
          is_deleted BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id),
          FOREIGN KEY (tipo_id) REFERENCES tarefa_tipo(tipo_id)
      );
    `);

    // Status Individual dos Funcionários
    await queryRunner.query(`
      CREATE TABLE tarefa_funcionario_status (
          status_id BIGSERIAL PRIMARY KEY,
          tarefa_id BIGINT NOT NULL,
          funcionario_id BIGINT NOT NULL,
          status VARCHAR(20) DEFAULT 'ATRIBUIDA' CHECK (status IN ('ATRIBUIDA', 'EM_ANDAMENTO', 'PAUSADA', 'PARADA', 'CONCLUIDA', 'CANCELADA')),
          tempo_gasto_minutos INTEGER DEFAULT 0,
          data_atribuicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          data_inicio TIMESTAMP,
          data_conclusao TIMESTAMP,
          observacoes_funcionario TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (tarefa_id) REFERENCES tarefa(tarefa_id),
          FOREIGN KEY (funcionario_id) REFERENCES funcionario(funcionario_id),
          UNIQUE (tarefa_id, funcionario_id)
      );
    `);

    // Histórico de Mudanças de Status
    await queryRunner.query(`
      CREATE TABLE tarefa_funcionario_status_historia (
          historia_status_id BIGSERIAL PRIMARY KEY,
          status_id BIGINT NOT NULL,
          status_anterior VARCHAR(20),
          status_novo VARCHAR(20),
          tempo_sessao_minutos INTEGER,
          motivo TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (status_id) REFERENCES tarefa_funcionario_status(status_id)
      );
    `);

    // Histórico Geral da Tarefa
    await queryRunner.query(`
      CREATE TABLE tarefa_historia (
          historia_id BIGSERIAL PRIMARY KEY,
          tarefa_id BIGINT NOT NULL,
          usuario_empresa_id BIGINT NOT NULL,
          tipo_evento VARCHAR(30) NOT NULL CHECK (tipo_evento IN ('COMENTARIO', 'ANEXO', 'ATRIBUICAO', 'ALTERACAO_DADOS', 'OBSERVACAO_GERENCIAL')),
          comentario TEXT,
          arquivo_url VARCHAR(500),
          dados_alterados JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (tarefa_id) REFERENCES tarefa(tarefa_id),
          FOREIGN KEY (usuario_empresa_id) REFERENCES usuario_empresa(usuario_empresa_id)
      );
    `);

    // Contas Financeiras
    await queryRunner.query(`
      CREATE TABLE conta (
          conta_id BIGSERIAL PRIMARY KEY,
          empresa_id BIGINT NOT NULL,
          nome VARCHAR(255) NOT NULL,
          tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('SOCIO', 'EMPRESA', 'BANCO', 'CAIXA')),
          saldo_inicial DECIMAL(15,2) DEFAULT 0,
          ativa BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL,
          is_deleted BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id)
      );
    `);

    // Centros de Custo
    await queryRunner.query(`
      CREATE TABLE centro_custo (
          centro_custo_id BIGSERIAL PRIMARY KEY,
          empresa_id BIGINT NOT NULL,
          nome VARCHAR(255) NOT NULL,
          descricao TEXT,
          ativo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL,
          is_deleted BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id)
      );
    `);

    // Terceiros (unindo Cliente e Fornecedor)
    await queryRunner.query(`
      CREATE TABLE terceiro (
          terceiro_id BIGSERIAL PRIMARY KEY,
          empresa_id BIGINT NOT NULL,
          nome VARCHAR(255) NOT NULL,
          tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('CLIENTE', 'FORNECEDOR', 'AMBOS')),
          cnpj_cpf VARCHAR(18),
          endereco TEXT,
          telefone VARCHAR(20),
          email VARCHAR(255),
          ativo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL,
          is_deleted BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id)
      );
    `);

    // Receitas e Despesas
    await queryRunner.query(`
      CREATE TABLE transacao_financeira (
          transacao_id BIGSERIAL PRIMARY KEY,
          empresa_id BIGINT NOT NULL,
          tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('RECEITA', 'DESPESA')),
          conta_id BIGINT NOT NULL,
          terceiro_id BIGINT NULL,
          descricao VARCHAR(255) NOT NULL,
          valor DECIMAL(15,2) NOT NULL,
          data_transacao DATE NOT NULL,
          data_vencimento DATE,
          status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'PAGO', 'CANCELADO')),
          observacoes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL,
          is_deleted BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id),
          FOREIGN KEY (conta_id) REFERENCES conta(conta_id),
          FOREIGN KEY (terceiro_id) REFERENCES terceiro(terceiro_id)
      );
    `);

    // Relacionamento Transação-Centro de Custo
    await queryRunner.query(`
      CREATE TABLE transacao_centro_custo (
          transacao_centro_custo_id BIGSERIAL PRIMARY KEY,
          transacao_id BIGINT NOT NULL,
          centro_custo_id BIGINT NOT NULL,
          percentual DECIMAL(5,2) NOT NULL,
          valor DECIMAL(15,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (transacao_id) REFERENCES transacao_financeira(transacao_id),
          FOREIGN KEY (centro_custo_id) REFERENCES centro_custo(centro_custo_id),
          UNIQUE (transacao_id, centro_custo_id)
      );
    `);

    // Empréstimos para Funcionários
    await queryRunner.query(`
      CREATE TABLE emprestimo (
          emprestimo_id BIGSERIAL PRIMARY KEY,
          empresa_id BIGINT NOT NULL,
          funcionario_id BIGINT NOT NULL,
          valor_total DECIMAL(10,2) NOT NULL,
          valor_pago DECIMAL(10,2) DEFAULT 0,
          valor_pendente DECIMAL(10,2) NOT NULL,
          total_parcelas INTEGER NOT NULL,
          parcelas_pagas INTEGER DEFAULT 0,
          quando_cobrar VARCHAR(20) NOT NULL CHECK (quando_cobrar IN ('MENSAL', 'FERIAS', '13_SALARIO', 'TUDO')),
          data_emprestimo DATE NOT NULL,
          data_inicio_cobranca DATE NOT NULL,
          status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'QUITADO', 'CANCELADO')),
          observacoes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id),
          FOREIGN KEY (funcionario_id) REFERENCES funcionario(funcionario_id)
      );
    `);

    // Pedidos de Compra
    await queryRunner.query(`
      CREATE TABLE pedido_compra (
          pedido_id BIGSERIAL PRIMARY KEY,
          empresa_id BIGINT NOT NULL,
          terceiro_id BIGINT NULL,
          usuario_empresa_solicitante_id BIGINT NOT NULL,
          centro_custo_id BIGINT NULL,
          descricao TEXT NOT NULL,
          valor_estimado DECIMAL(15,2),
          data_solicitacao DATE NOT NULL,
          status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'APROVADO', 'COMPRADO', 'CANCELADO')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id),
          FOREIGN KEY (terceiro_id) REFERENCES terceiro(terceiro_id),
          FOREIGN KEY (usuario_empresa_solicitante_id) REFERENCES usuario_empresa(usuario_empresa_id),
          FOREIGN KEY (centro_custo_id) REFERENCES centro_custo(centro_custo_id)
      );
    `);

    // Adicionar FK que não pôde ser criada antes
    await queryRunner.query(`
      ALTER TABLE tarefa_tipo 
      ADD CONSTRAINT fk_tarefa_tipo_centro_custo 
      FOREIGN KEY (centro_custo_id) REFERENCES centro_custo(centro_custo_id);
    `);

    // Índices para performance
    await queryRunner.query(`CREATE INDEX idx_user_email ON "user"(email);`);
    await queryRunner.query(`CREATE INDEX idx_user_deleted ON "user"(is_deleted);`);
    await queryRunner.query(`CREATE INDEX idx_jwt_token_user ON jwt_token(user_id);`);
    await queryRunner.query(`CREATE INDEX idx_jwt_token_expiration ON jwt_token(expiration_date);`);
    await queryRunner.query(`CREATE INDEX idx_empresa_ativa ON empresa(ativa);`);
    await queryRunner.query(`CREATE INDEX idx_empresa_cnpj ON empresa(cnpj) WHERE cnpj IS NOT NULL;`);
    await queryRunner.query(`CREATE INDEX idx_funcionario_empresa ON funcionario(empresa_id);`);
    await queryRunner.query(`CREATE INDEX idx_funcionario_ativo ON funcionario(ativo);`);
    await queryRunner.query(`CREATE INDEX idx_funcionario_apelido ON funcionario(empresa_id, apelido);`);
    await queryRunner.query(`CREATE INDEX idx_tarefa_empresa ON tarefa(empresa_id);`);
    await queryRunner.query(`CREATE INDEX idx_tarefa_status ON tarefa(status);`);
    await queryRunner.query(`CREATE INDEX idx_tarefa_funcionario_status ON tarefa_funcionario_status(status);`);
    await queryRunner.query(`CREATE INDEX idx_tarefa_funcionario_tempo ON tarefa_funcionario_status(tempo_gasto_minutos);`);
    await queryRunner.query(`CREATE INDEX idx_transacao_empresa ON transacao_financeira(empresa_id);`);
    await queryRunner.query(`CREATE INDEX idx_transacao_data ON transacao_financeira(data_transacao);`);
    await queryRunner.query(`CREATE INDEX idx_transacao_status ON transacao_financeira(status);`);
    await queryRunner.query(`CREATE INDEX idx_pedido_empresa ON pedido_compra(empresa_id);`);
    await queryRunner.query(`CREATE INDEX idx_pedido_status ON pedido_compra(status);`);
    await queryRunner.query(`CREATE INDEX idx_terceiro_empresa ON terceiro(empresa_id);`);
    await queryRunner.query(`CREATE INDEX idx_terceiro_tipo ON terceiro(tipo);`);

    // Triggers para atualização automática
    await queryRunner.query(`
      CREATE TRIGGER update_user_updated_at 
          BEFORE UPDATE ON "user" 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_empresa_updated_at 
          BEFORE UPDATE ON empresa 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_usuario_empresa_updated_at 
          BEFORE UPDATE ON usuario_empresa 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_role_updated_at 
          BEFORE UPDATE ON role 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_funcionario_updated_at 
          BEFORE UPDATE ON funcionario 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_funcionario_contrato_updated_at 
          BEFORE UPDATE ON funcionario_contrato 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_funcionario_beneficio_desconto_updated_at 
          BEFORE UPDATE ON funcionario_beneficio_desconto 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_tarefa_tipo_updated_at 
          BEFORE UPDATE ON tarefa_tipo 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_tarefa_updated_at 
          BEFORE UPDATE ON tarefa 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_tarefa_funcionario_status_updated_at 
          BEFORE UPDATE ON tarefa_funcionario_status 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_conta_updated_at 
          BEFORE UPDATE ON conta 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_centro_custo_updated_at 
          BEFORE UPDATE ON centro_custo 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_terceiro_updated_at 
          BEFORE UPDATE ON terceiro 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_transacao_financeira_updated_at 
          BEFORE UPDATE ON transacao_financeira 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_emprestimo_updated_at 
          BEFORE UPDATE ON emprestimo 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_pedido_compra_updated_at 
          BEFORE UPDATE ON pedido_compra 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_pedido_compra_updated_at ON pedido_compra;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_emprestimo_updated_at ON emprestimo;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_transacao_financeira_updated_at ON transacao_financeira;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_terceiro_updated_at ON terceiro;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_centro_custo_updated_at ON centro_custo;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_conta_updated_at ON conta;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_tarefa_funcionario_status_updated_at ON tarefa_funcionario_status;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_tarefa_updated_at ON tarefa;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_tarefa_tipo_updated_at ON tarefa_tipo;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_funcionario_beneficio_desconto_updated_at ON funcionario_beneficio_desconto;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_funcionario_contrato_updated_at ON funcionario_contrato;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_funcionario_updated_at ON funcionario;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_role_updated_at ON role;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_usuario_empresa_updated_at ON usuario_empresa;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_empresa_updated_at ON empresa;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_user_updated_at ON "user";`);

    // Drop all tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS pedido_compra;`);
    await queryRunner.query(`DROP TABLE IF EXISTS emprestimo;`);
    await queryRunner.query(`DROP TABLE IF EXISTS transacao_centro_custo;`);
    await queryRunner.query(`DROP TABLE IF EXISTS transacao_financeira;`);
    await queryRunner.query(`DROP TABLE IF EXISTS terceiro;`);
    await queryRunner.query(`DROP TABLE IF EXISTS centro_custo;`);
    await queryRunner.query(`DROP TABLE IF EXISTS conta;`);
    await queryRunner.query(`DROP TABLE IF EXISTS tarefa_historia;`);
    await queryRunner.query(`DROP TABLE IF EXISTS tarefa_funcionario_status_historia;`);
    await queryRunner.query(`DROP TABLE IF EXISTS tarefa_funcionario_status;`);
    await queryRunner.query(`DROP TABLE IF EXISTS tarefa;`);
    await queryRunner.query(`DROP TABLE IF EXISTS tarefa_tipo;`);
    await queryRunner.query(`DROP TABLE IF EXISTS funcionario_beneficio_desconto;`);
    await queryRunner.query(`DROP TABLE IF EXISTS funcionario_contrato;`);
    await queryRunner.query(`DROP TABLE IF EXISTS funcionario;`);
    await queryRunner.query(`DROP TABLE IF EXISTS role;`);
    await queryRunner.query(`DROP TABLE IF EXISTS usuario_empresa;`);
    await queryRunner.query(`DROP TABLE IF EXISTS empresa;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jwt_token;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user";`);

    // Drop function
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column();`);
  }
}

