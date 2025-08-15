import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import all entities
import { User } from '@/entities/User';
import { JwtToken } from '@/entities/JwtToken';
import { Empresa } from '@/entities/Empresa';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';
import { Role } from '@/entities/Role';
import { Funcionario } from '@/entities/Funcionario';
import { FuncionarioContrato } from '@/entities/FuncionarioContrato';
import { FuncionarioBeneficioDesconto } from '@/entities/FuncionarioBeneficioDesconto';
import { TarefaTipo } from '@/entities/TarefaTipo';
import { Tarefa } from '@/entities/Tarefa';
import { TarefaFuncionarioStatus } from '@/entities/TarefaFuncionarioStatus';
import { TarefaFuncionarioStatusHistoria } from '@/entities/TarefaFuncionarioStatusHistoria';
import { TarefaHistoria } from '@/entities/TarefaHistoria';
import { Conta } from '@/entities/Conta';
import { CentroCusto } from '@/entities/CentroCusto';
import { Terceiro } from '@/entities/Terceiro';
import { TransacaoFinanceira } from '@/entities/TransacaoFinanceira';
import { TransacaoCentroCusto } from '@/entities/TransacaoCentroCusto';
import { Emprestimo } from '@/entities/Emprestimo';
import { PedidoCompra } from '@/entities/PedidoCompra';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'erp',
  schema: process.env.DB_SCHEMA || 'public',
  synchronize: false, // Use migrations instead
  logging: false,
  entities: [
    User,
    JwtToken,
    Empresa,
    UsuarioEmpresa,
    Role,
    Funcionario,
    FuncionarioContrato,
    FuncionarioBeneficioDesconto,
    TarefaTipo,
    Tarefa,
    TarefaFuncionarioStatus,
    TarefaFuncionarioStatusHistoria,
    TarefaHistoria,
    Conta,
    CentroCusto,
    Terceiro,
    TransacaoFinanceira,
    TransacaoCentroCusto,
    Emprestimo,
    PedidoCompra
  ],
  migrations: ['./src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    throw error;
  }
};

