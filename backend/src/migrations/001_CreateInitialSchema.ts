import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1703000000001 implements MigrationInterface {
  name = 'CreateInitialSchema1703000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM types
    await queryRunner.query(`
      CREATE TYPE "contract_type_enum" AS ENUM('CLT', 'Diarista', 'Empreita');
      CREATE TYPE "employee_status_enum" AS ENUM('Ativo', 'Inativo', 'Afastado', 'Demitido');
      CREATE TYPE "document_type_enum" AS ENUM('RG', 'CPF', 'Carteira_Trabalho', 'Comprovante_Residencia', 'Atestado_Medico', 'Outros');
      CREATE TYPE "account_type_enum" AS ENUM('Conta_Corrente', 'Caixa_Fisico', 'Cartao_Credito', 'Conta_Socio', 'Poupanca', 'Investimento');
      CREATE TYPE "account_status_enum" AS ENUM('Ativa', 'Inativa', 'Bloqueada');
      CREATE TYPE "cost_center_status_enum" AS ENUM('Ativo', 'Inativo');
      CREATE TYPE "transaction_category_enum" AS ENUM('Receita', 'Despesa', 'Transferencia', 'Adiantamento', 'Emprestimo');
      CREATE TYPE "payment_method_enum" AS ENUM('Dinheiro', 'PIX', 'TED', 'Cartao_Debito', 'Cartao_Credito', 'Boleto', 'Cheque');
      CREATE TYPE "transaction_status_enum" AS ENUM('Pendente', 'Confirmada', 'Cancelada', 'Estornada');
      CREATE TYPE "task_type_status_enum" AS ENUM('Ativo', 'Inativo');
      CREATE TYPE "task_priority_enum" AS ENUM('Baixa', 'Media', 'Alta', 'Urgente');
      CREATE TYPE "task_status_enum" AS ENUM('Pendente', 'Aprovada', 'Em_Andamento', 'Pausada', 'Parada', 'Concluida', 'Cancelada', 'Rejeitada');
      CREATE TYPE "frequency_type_enum" AS ENUM('Unica', 'Diaria', 'Semanal', 'Mensal', 'Anual');
      CREATE TYPE "assignment_type_enum" AS ENUM('Principal', 'Auxiliar', 'Supervisor');
      CREATE TYPE "tracking_action_enum" AS ENUM('Inicio', 'Pausa', 'Retomada', 'Fim');
      CREATE TYPE "history_action_enum" AS ENUM('Criada', 'Atualizada', 'Aprovada', 'Rejeitada', 'Iniciada', 'Pausada', 'Retomada', 'Parada', 'Finalizada', 'Cancelada', 'Adiada');
      CREATE TYPE "comment_type_enum" AS ENUM('Geral', 'Problema', 'Solucao', 'Aprovacao', 'Rejeicao');
      CREATE TYPE "attachment_type_enum" AS ENUM('Instrucao', 'Referencia', 'Resultado', 'Problema', 'Outros');
      CREATE TYPE "period_type_enum" AS ENUM('Mensal', 'Quinzenal', 'Semanal');
      CREATE TYPE "payroll_status_enum" AS ENUM('Aberto', 'Em_Processamento', 'Fechado', 'Pago', 'Cancelado');
      CREATE TYPE "payroll_item_type_enum" AS ENUM('Salario_Base', 'Horas_Extras', 'Adicional_Noturno', 'DSR', 'Ferias', 'Decimo_Terceiro', 'Desconto_INSS', 'Desconto_IRRF', 'Desconto_FGTS', 'Desconto_Adiantamento', 'Desconto_Falta', 'Beneficio_Vale_Transporte', 'Beneficio_Vale_Refeicao', 'Outros_Proventos', 'Outros_Descontos');
      CREATE TYPE "category_status_enum" AS ENUM('Ativa', 'Inativa');
      CREATE TYPE "request_priority_enum" AS ENUM('Baixa', 'Media', 'Alta', 'Urgente');
      CREATE TYPE "request_status_enum" AS ENUM('Pendente', 'Em_Analise', 'Aprovada', 'Rejeitada', 'Comprada', 'Entregue', 'Cancelada');
      CREATE TYPE "item_status_enum" AS ENUM('Pendente', 'Cotado', 'Comprado', 'Entregue', 'Cancelado');
      CREATE TYPE "purchase_attachment_type_enum" AS ENUM('Especificacao', 'Orcamento', 'Nota_Fiscal', 'Foto_Necessidade', 'Manual', 'Outros');
      CREATE TYPE "purchase_comment_type_enum" AS ENUM('Geral', 'Pergunta', 'Resposta', 'Aprovacao', 'Rejeicao', 'Atualizacao_Status');
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(255) NOT NULL,
        "email" varchar(255) UNIQUE NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "facial_recognition_vector" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create companies table
    await queryRunner.query(`
      CREATE TABLE "companies" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(255) NOT NULL,
        "owner_id" uuid NOT NULL REFERENCES "users"("id"),
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" serial PRIMARY KEY,
        "company_id" uuid NOT NULL REFERENCES "companies"("id"),
        "name" varchar(100) NOT NULL,
        "permissions" json NOT NULL,
        UNIQUE("company_id", "name")
      )
    `);

    // Create company_members table
    await queryRunner.query(`
      CREATE TABLE "company_members" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "company_id" uuid NOT NULL REFERENCES "companies"("id"),
        "role_id" integer NOT NULL REFERENCES "roles"("id"),
        UNIQUE("user_id", "company_id")
      )
    `);

    // Create employees table
    await queryRunner.query(`
      CREATE TABLE "employees" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id"),
        "company_member_id" uuid REFERENCES "company_members"("id"),
        "full_name" varchar(255) NOT NULL,
        "cpf" varchar(14) NOT NULL,
        "job_title" varchar(255) NOT NULL,
        "contract_type" contract_type_enum NOT NULL,
        "salary_base" decimal(10,2) NOT NULL,
        "hire_date" date NOT NULL,
        "termination_date" date,
        "status" employee_status_enum DEFAULT 'Ativo',
        "config_tracks_time" boolean DEFAULT true,
        "config_is_in_payroll" boolean DEFAULT true,
        "legal_data" json NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        UNIQUE("company_id", "cpf")
      )
    `);

    // Create employee_documents table
    await queryRunner.query(`
      CREATE TABLE "employee_documents" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "employee_id" uuid NOT NULL REFERENCES "employees"("id"),
        "document_type" document_type_enum NOT NULL,
        "file_url" varchar(500) NOT NULL,
        "description" varchar(255),
        "uploaded_by_user_id" uuid NOT NULL REFERENCES "users"("id"),
        "uploaded_at" timestamp DEFAULT now()
      )
    `);

    // Create financial_accounts table
    await queryRunner.query(`
      CREATE TABLE "financial_accounts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id"),
        "name" varchar(255) NOT NULL,
        "type" account_type_enum NOT NULL,
        "initial_balance" decimal(15,2) NOT NULL,
        "current_balance" decimal(15,2) NOT NULL,
        "owner_user_id" uuid REFERENCES "users"("id"),
        "bank_details" json,
        "status" account_status_enum DEFAULT 'Ativa',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create cost_centers table
    await queryRunner.query(`
      CREATE TABLE "cost_centers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id"),
        "name" varchar(255) NOT NULL,
        "description" text,
        "parent_id" uuid REFERENCES "cost_centers"("id"),
        "status" cost_center_status_enum DEFAULT 'Ativo',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        UNIQUE("company_id", "name")
      )
    `);

    // Create transactions table
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id"),
        "financial_account_id" uuid NOT NULL REFERENCES "financial_accounts"("id"),
        "transaction_number" varchar(50) NOT NULL,
        "description" varchar(500) NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "transaction_date" date NOT NULL,
        "due_date" date,
        "category" transaction_category_enum NOT NULL,
        "payment_method" payment_method_enum NOT NULL,
        "related_employee_id" uuid REFERENCES "employees"("id"),
        "invoice_number" varchar(100),
        "supplier_customer" varchar(255),
        "notes" text,
        "status" transaction_status_enum DEFAULT 'Pendente',
        "created_by_user_id" uuid NOT NULL REFERENCES "users"("id"),
        "approved_by_user_id" uuid REFERENCES "users"("id"),
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create transaction_splits table
    await queryRunner.query(`
      CREATE TABLE "transaction_splits" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "transaction_id" uuid NOT NULL REFERENCES "transactions"("id"),
        "cost_center_id" uuid NOT NULL REFERENCES "cost_centers"("id"),
        "amount" decimal(15,2) NOT NULL,
        "percentage" decimal(5,2) NOT NULL,
        "description" varchar(255)
      )
    `);

    // Create employee_ledger table
    await queryRunner.query(`
      CREATE TABLE "employee_ledger" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "employee_id" uuid NOT NULL REFERENCES "employees"("id"),
        "transaction_id" uuid REFERENCES "transactions"("id"),
        "description" varchar(500) NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "entry_date" date NOT NULL,
        "balance_after" decimal(15,2) NOT NULL,
        "created_by_user_id" uuid NOT NULL REFERENCES "users"("id"),
        "created_at" timestamp DEFAULT now()
      )
    `);

    // Create task_types table
    await queryRunner.query(`
      CREATE TABLE "task_types" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id"),
        "name" varchar(255) NOT NULL,
        "description" text,
        "default_cost_center_id" uuid REFERENCES "cost_centers"("id"),
        "estimated_duration_hours" decimal(8,2),
        "requires_approval" boolean DEFAULT false,
        "default_approver_id" uuid REFERENCES "users"("id"),
        "default_instructions" json,
        "color" varchar(50),
        "icon" varchar(50),
        "status" task_type_status_enum DEFAULT 'Ativo',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        UNIQUE("company_id", "name")
      )
    `);

    // Create tasks table
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id"),
        "task_type_id" uuid NOT NULL REFERENCES "task_types"("id"),
        "cost_center_id" uuid NOT NULL REFERENCES "cost_centers"("id"),
        "title" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "priority" task_priority_enum NOT NULL,
        "status" task_status_enum DEFAULT 'Pendente',
        "estimated_hours" decimal(8,2) NOT NULL,
        "actual_hours" decimal(8,2),
        "estimated_start_date" date NOT NULL,
        "due_date" date NOT NULL,
        "actual_start_date" date,
        "actual_end_date" date,
        "frequency_type" frequency_type_enum DEFAULT 'Unica',
        "frequency_config" json,
        "parent_task_id" uuid REFERENCES "tasks"("id"),
        "instructions" text,
        "completion_notes" text,
        "quality_rating" integer CHECK (quality_rating >= 1 AND quality_rating <= 5),
        "created_by_user_id" uuid NOT NULL REFERENCES "users"("id"),
        "approved_by_user_id" uuid REFERENCES "users"("id"),
        "approved_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create task_assignments table
    await queryRunner.query(`
      CREATE TABLE "task_assignments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "task_id" uuid NOT NULL REFERENCES "tasks"("id"),
        "employee_id" uuid NOT NULL REFERENCES "employees"("id"),
        "assignment_type" assignment_type_enum NOT NULL,
        "estimated_hours" decimal(8,2) NOT NULL,
        "actual_hours" decimal(8,2),
        "hourly_rate" decimal(10,2),
        "total_cost" decimal(10,2),
        "assigned_at" timestamp DEFAULT now()
      )
    `);

    // Create task_time_tracking table
    await queryRunner.query(`
      CREATE TABLE "task_time_tracking" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "task_id" uuid NOT NULL REFERENCES "tasks"("id"),
        "employee_id" uuid NOT NULL REFERENCES "employees"("id"),
        "action" tracking_action_enum NOT NULL,
        "timestamp" timestamp NOT NULL,
        "location" varchar(255),
        "notes" text,
        "duration_hours" decimal(8,2),
        "created_at" timestamp DEFAULT now()
      )
    `);

    // Create task_history table
    await queryRunner.query(`
      CREATE TABLE "task_history" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "task_id" uuid NOT NULL REFERENCES "tasks"("id"),
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "employee_id" uuid REFERENCES "employees"("id"),
        "action" history_action_enum NOT NULL,
        "previous_status" varchar(100),
        "new_status" varchar(100),
        "description" text,
        "field_changes" json,
        "timestamp" timestamp DEFAULT now()
      )
    `);

    // Create task_comments table
    await queryRunner.query(`
      CREATE TABLE "task_comments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "task_id" uuid NOT NULL REFERENCES "tasks"("id"),
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "comment" text NOT NULL,
        "comment_type" comment_type_enum DEFAULT 'Geral',
        "parent_comment_id" uuid REFERENCES "task_comments"("id"),
        "is_internal" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create task_attachments table
    await queryRunner.query(`
      CREATE TABLE "task_attachments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "task_id" uuid NOT NULL REFERENCES "tasks"("id"),
        "uploaded_by_user_id" uuid NOT NULL REFERENCES "users"("id"),
        "file_url" varchar(500) NOT NULL,
        "file_name" varchar(255) NOT NULL,
        "file_type" varchar(100) NOT NULL,
        "attachment_type" attachment_type_enum NOT NULL,
        "description" varchar(255),
        "uploaded_at" timestamp DEFAULT now()
      )
    `);

    // Create payroll_periods table
    await queryRunner.query(`
      CREATE TABLE "payroll_periods" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id"),
        "period_month" smallint NOT NULL CHECK (period_month >= 1 AND period_month <= 12),
        "period_year" smallint NOT NULL,
        "period_type" period_type_enum NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "cutoff_date" date NOT NULL,
        "status" payroll_status_enum DEFAULT 'Aberto',
        "total_gross_amount" decimal(15,2) DEFAULT 0,
        "total_net_amount" decimal(15,2) DEFAULT 0,
        "total_taxes" decimal(15,2) DEFAULT 0,
        "total_benefits" decimal(15,2) DEFAULT 0,
        "processed_at" timestamp,
        "processed_by_user_id" uuid REFERENCES "users"("id"),
        "approved_at" timestamp,
        "approved_by_user_id" uuid REFERENCES "users"("id"),
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create payroll_items table
    await queryRunner.query(`
      CREATE TABLE "payroll_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "payroll_period_id" uuid NOT NULL REFERENCES "payroll_periods"("id"),
        "employee_id" uuid NOT NULL REFERENCES "employees"("id"),
        "item_type" payroll_item_type_enum NOT NULL,
        "description" varchar(500) NOT NULL,
        "calculation_basis" decimal(15,4) NOT NULL,
        "rate" decimal(10,4) NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "is_taxable" boolean DEFAULT true,
        "legal_reference" varchar(255),
        "calculation_details" json,
        "created_at" timestamp DEFAULT now()
      )
    `);

    // Create employee_timesheets table
    await queryRunner.query(`
      CREATE TABLE "employee_timesheets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "employee_id" uuid NOT NULL REFERENCES "employees"("id"),
        "payroll_period_id" uuid NOT NULL REFERENCES "payroll_periods"("id"),
        "total_worked_hours" decimal(8,2) DEFAULT 0,
        "regular_hours" decimal(8,2) DEFAULT 0,
        "overtime_hours" decimal(8,2) DEFAULT 0,
        "night_shift_hours" decimal(8,2) DEFAULT 0,
        "weekend_hours" decimal(8,2) DEFAULT 0,
        "holiday_hours" decimal(8,2) DEFAULT 0,
        "absent_hours" decimal(8,2) DEFAULT 0,
        "justified_absent_hours" decimal(8,2) DEFAULT 0,
        "vacation_hours" decimal(8,2) DEFAULT 0,
        "days_worked" integer DEFAULT 0,
        "calculation_details" json,
        "generated_at" timestamp DEFAULT now(),
        "approved_by_user_id" uuid REFERENCES "users"("id"),
        "approved_at" timestamp
      )
    `);

    // Create purchase_categories table
    await queryRunner.query(`
      CREATE TABLE "purchase_categories" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id"),
        "name" varchar(255) NOT NULL,
        "description" text,
        "default_approver_id" uuid REFERENCES "users"("id"),
        "requires_justification" boolean DEFAULT false,
        "budget_limit" decimal(15,2),
        "icon" varchar(50),
        "color" varchar(50),
        "status" category_status_enum DEFAULT 'Ativa',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create purchase_requests table
    await queryRunner.query(`
      CREATE TABLE "purchase_requests" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id"),
        "category_id" uuid NOT NULL REFERENCES "purchase_categories"("id"),
        "cost_center_id" uuid NOT NULL REFERENCES "cost_centers"("id"),
        "title" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "justification" text,
        "priority" request_priority_enum NOT NULL,
        "estimated_total_cost" decimal(15,2),
        "requested_delivery_date" date,
        "status" request_status_enum DEFAULT 'Pendente',
        "requested_by_employee_id" uuid REFERENCES "employees"("id"),
        "requested_by_user_id" uuid NOT NULL REFERENCES "users"("id"),
        "assigned_buyer_id" uuid REFERENCES "users"("id"),
        "approved_by_user_id" uuid REFERENCES "users"("id"),
        "approved_at" timestamp,
        "rejection_reason" text,
        "purchase_notes" text,
        "delivery_notes" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create purchase_items table
    await queryRunner.query(`
      CREATE TABLE "purchase_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "purchase_request_id" uuid NOT NULL REFERENCES "purchase_requests"("id"),
        "item_name" varchar(255) NOT NULL,
        "brand_preference" varchar(255),
        "specifications" text,
        "quantity" decimal(10,3) NOT NULL,
        "unit" varchar(50) NOT NULL,
        "estimated_unit_price" decimal(15,2),
        "estimated_total_price" decimal(15,2),
        "actual_unit_price" decimal(15,2),
        "actual_total_price" decimal(15,2),
        "supplier" varchar(255),
        "item_status" item_status_enum DEFAULT 'Pendente',
        "notes" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create purchase_attachments table
    await queryRunner.query(`
      CREATE TABLE "purchase_attachments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "purchase_request_id" uuid NOT NULL REFERENCES "purchase_requests"("id"),
        "purchase_item_id" uuid REFERENCES "purchase_items"("id"),
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "file_url" varchar(500) NOT NULL,
        "file_name" varchar(255) NOT NULL,
        "file_type" varchar(100) NOT NULL,
        "attachment_type" purchase_attachment_type_enum NOT NULL,
        "description" varchar(255),
        "uploaded_at" timestamp DEFAULT now()
      )
    `);

    // Create purchase_comments table
    await queryRunner.query(`
      CREATE TABLE "purchase_comments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "purchase_request_id" uuid NOT NULL REFERENCES "purchase_requests"("id"),
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "employee_id" uuid REFERENCES "employees"("id"),
        "comment" text NOT NULL,
        "comment_type" purchase_comment_type_enum DEFAULT 'Geral',
        "is_internal" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX "idx_users_email" ON "users"("email");
      CREATE INDEX "idx_companies_owner_id" ON "companies"("owner_id");
      CREATE INDEX "idx_company_members_user_company" ON "company_members"("user_id", "company_id");
      CREATE INDEX "idx_employees_company_id" ON "employees"("company_id");
      CREATE INDEX "idx_employees_cpf" ON "employees"("cpf");
      CREATE INDEX "idx_transactions_company_id" ON "transactions"("company_id");
      CREATE INDEX "idx_transactions_date" ON "transactions"("transaction_date");
      CREATE INDEX "idx_transactions_account_id" ON "transactions"("financial_account_id");
      CREATE INDEX "idx_tasks_company_id" ON "tasks"("company_id");
      CREATE INDEX "idx_tasks_status" ON "tasks"("status");
      CREATE INDEX "idx_tasks_due_date" ON "tasks"("due_date");
      CREATE INDEX "idx_task_assignments_task_id" ON "task_assignments"("task_id");
      CREATE INDEX "idx_task_assignments_employee_id" ON "task_assignments"("employee_id");
      CREATE INDEX "idx_payroll_periods_company_period" ON "payroll_periods"("company_id", "period_year", "period_month");
      CREATE INDEX "idx_purchase_requests_company_id" ON "purchase_requests"("company_id");
      CREATE INDEX "idx_purchase_requests_status" ON "purchase_requests"("status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_comments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_attachments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_items" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_requests" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_categories" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "employee_timesheets" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payroll_items" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payroll_periods" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_attachments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_comments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_history" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_time_tracking" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_assignments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_types" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "employee_ledger" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "transaction_splits" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "transactions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cost_centers" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "financial_accounts" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "employee_documents" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "employees" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "company_members" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "companies" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);

    // Drop ENUM types
    await queryRunner.query(`
      DROP TYPE IF EXISTS "purchase_comment_type_enum";
      DROP TYPE IF EXISTS "purchase_attachment_type_enum";
      DROP TYPE IF EXISTS "item_status_enum";
      DROP TYPE IF EXISTS "request_status_enum";
      DROP TYPE IF EXISTS "request_priority_enum";
      DROP TYPE IF EXISTS "category_status_enum";
      DROP TYPE IF EXISTS "payroll_item_type_enum";
      DROP TYPE IF EXISTS "payroll_status_enum";
      DROP TYPE IF EXISTS "period_type_enum";
      DROP TYPE IF EXISTS "attachment_type_enum";
      DROP TYPE IF EXISTS "comment_type_enum";
      DROP TYPE IF EXISTS "history_action_enum";
      DROP TYPE IF EXISTS "tracking_action_enum";
      DROP TYPE IF EXISTS "assignment_type_enum";
      DROP TYPE IF EXISTS "frequency_type_enum";
      DROP TYPE IF EXISTS "task_status_enum";
      DROP TYPE IF EXISTS "task_priority_enum";
      DROP TYPE IF EXISTS "task_type_status_enum";
      DROP TYPE IF EXISTS "transaction_status_enum";
      DROP TYPE IF EXISTS "payment_method_enum";
      DROP TYPE IF EXISTS "transaction_category_enum";
      DROP TYPE IF EXISTS "cost_center_status_enum";
      DROP TYPE IF EXISTS "account_status_enum";
      DROP TYPE IF EXISTS "account_type_enum";
      DROP TYPE IF EXISTS "document_type_enum";
      DROP TYPE IF EXISTS "employee_status_enum";
      DROP TYPE IF EXISTS "contract_type_enum";
    `);
  }
}

