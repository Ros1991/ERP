import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Company } from '../entities/Company';
import { Role } from '../entities/Role';
import { CompanyMember } from '../entities/CompanyMember';
import bcrypt from 'bcrypt';

export class AdminSeed {
  static async run(): Promise<void> {
    try {
      console.log('🌱 Verificando se é necessário criar usuário admin padrão...');

      const userRepository = AppDataSource.getRepository(User);
      const companyRepository = AppDataSource.getRepository(Company);
      const roleRepository = AppDataSource.getRepository(Role);
      const companyMemberRepository = AppDataSource.getRepository(CompanyMember);

      // Verificar se já existem usuários no sistema
      const userCount = await userRepository.count();

      if (userCount > 0) {
        console.log('✅ Usuários já existem no sistema. Seed não necessário.');
        return;
      }

      console.log('🌱 Nenhum usuário encontrado. Criando usuário admin padrão...');

      // Dados do admin padrão
      const adminData = {
        name: 'Administrador',
        email: 'admin@sistema.com',
        password: 'admin123',
        companyName: 'Sistema ERP - Admin'
      };

      // Hash da senha
      const passwordHash = await bcrypt.hash(adminData.password, 10);

      // Criar usuário admin
      const adminUser = userRepository.create({
        name: adminData.name,
        email: adminData.email,
        password_hash: passwordHash,
        facial_recognition_vector: null
      });

      const savedUser = await userRepository.save(adminUser);
      console.log(`👤 Usuário admin criado: ${savedUser.email}`);

      // Criar empresa padrão
      const adminCompany = companyRepository.create({
        name: adminData.companyName,
        owner_id: savedUser.id
      });

      const savedCompany = await companyRepository.save(adminCompany);
      console.log(`🏢 Empresa criada: ${savedCompany.name}`);

      // Criar role de Super Admin
      const adminPermissions = [
        // Usuários e Autenticação
        'users.view',
        'users.create',
        'users.edit',
        'users.delete',
        'auth.manage',

        // Empresas
        'companies.view',
        'companies.create',
        'companies.edit',
        'companies.delete',
        'companies.manage',

        // Funcionários
        'employees.view',
        'employees.create',
        'employees.edit',
        'employees.delete',
        'employees.manage',

        // Financeiro
        'financial.view',
        'financial.create',
        'financial.edit',
        'financial.delete',
        'financial.manage',
        'financial.accounts',
        'financial.transactions',
        'financial.reports',

        // Folha de Pagamento
        'payroll.view',
        'payroll.create',
        'payroll.edit',
        'payroll.delete',
        'payroll.process',
        'payroll.approve',
        'payroll.reports',

        // Tarefas
        'tasks.view',
        'tasks.create',
        'tasks.edit',
        'tasks.delete',
        'tasks.assign',
        'tasks.manage',

        // Compras
        'purchases.view',
        'purchases.create',
        'purchases.edit',
        'purchases.delete',
        'purchases.approve',
        'purchases.manage',

        // Relatórios
        'reports.view',
        'reports.create',
        'reports.export',
        'reports.manage',

        // Sistema
        'system.admin',
        'system.settings',
        'system.backup',
        'system.logs',

        // Dashboard
        'dashboard.view',
        'dashboard.analytics'
      ];

      const adminRole = roleRepository.create({
        company_id: savedCompany.id,
        name: 'Super Admin',
        permissions: adminPermissions
      });

      const savedRole = await roleRepository.save(adminRole);
      console.log(`🔐 Role criada: ${savedRole.name} com ${adminPermissions.length} permissões`);

      // Associar usuário à empresa com role de admin
      const companyMember = companyMemberRepository.create({
        user_id: savedUser.id,
        company_id: savedCompany.id,
        role_id: savedRole.id
      });

      await companyMemberRepository.save(companyMember);
      console.log('🔗 Usuário associado à empresa como Super Admin');

      console.log('\n✅ SEED ADMIN CONCLUÍDO COM SUCESSO!');
      console.log('📧 Email: admin@sistema.com');
      console.log('🔑 Senha: admin123');
      console.log('🏢 Empresa: Sistema ERP - Admin');
      console.log('\n⚠️  ALTERE A SENHA PADRÃO APÓS O PRIMEIRO LOGIN!');

    } catch (error) {
      console.error('❌ Erro ao executar seed do admin:', error);
      throw error;
    }
  }
}
