# Backend CRUD Completo - Sistema Multi-Empresa

Backend Node.js/TypeScript completo com CRUD para todas as tabelas do sistema multi-empresa, desenvolvido com Express, TypeORM e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web
- **TypeORM** - ORM para TypeScript/JavaScript
- **PostgreSQL** - Sistema de gerenciamento de banco de dados
- **Class-validator** - Validação de dados
- **Class-transformer** - Transformação de objetos
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Segurança HTTP
- **Morgan** - Logger HTTP

## 📁 Estrutura do Projeto

```
backend-crud-completo/
├── src/                     # Código fonte principal
│   ├── config/             # Configurações do sistema
│   ├── controllers/        # Controladores HTTP
│   ├── core/               # Pasta CORE (mantida intacta do modelo)
│   │   ├── base/          # Classes base genéricas
│   │   ├── errors/        # Tratamento de erros
│   │   └── validation/    # Validações
│   ├── database/          # Configurações de banco
│   ├── decorators/        # Decorators customizados
│   ├── dtos/              # Data Transfer Objects
│   ├── entities/          # Entidades TypeORM
│   ├── mappers/           # Mapeadores entre DTOs e Entities
│   ├── middleware/        # Middlewares customizados
│   ├── migrations/        # Migrations do banco
│   ├── repositories/      # Camada de acesso a dados
│   ├── routes/            # Definição de rotas
│   ├── scripts/           # Scripts utilitários
│   ├── services/          # Lógica de negócio
│   ├── utils/             # Utilitários gerais
│   └── app.ts             # Arquivo principal da aplicação
├── package.json           # Dependências e scripts
├── tsconfig.json          # Configuração TypeScript
├── server.ts              # Ponto de entrada do servidor
└── README.md              # Documentação
```

## 🗃️ Entidades Implementadas

### Gestão de Usuários e Empresas
- **User** - Usuários do sistema
- **JwtToken** - Tokens de autenticação
- **Empresa** - Empresas do sistema
- **UsuarioEmpresa** - Relacionamento usuário-empresa
- **Role** - Papéis/permissões

### Gestão de Funcionários
- **Funcionario** - Dados dos funcionários
- **FuncionarioContrato** - Contratos de trabalho
- **FuncionarioBeneficioDesconto** - Benefícios e descontos

### Gestão de Tarefas
- **TarefaTipo** - Tipos de tarefa
- **Tarefa** - Tarefas do sistema
- **TarefaFuncionarioStatus** - Status individual por funcionário
- **TarefaFuncionarioStatusHistoria** - Histórico de mudanças
- **TarefaHistoria** - Histórico geral das tarefas

### Gestão Financeira
- **Conta** - Contas financeiras
- **CentroCusto** - Centros de custo
- **Terceiro** - Clientes e fornecedores
- **TransacaoFinanceira** - Receitas e despesas
- **TransacaoCentroCusto** - Relacionamento transação-centro de custo
- **Emprestimo** - Empréstimos para funcionários

### Gestão de Compras
- **PedidoCompra** - Pedidos de compra

## 🛠️ Instalação e Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=sistema_multi_empresa
DB_SCHEMA=public

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=*
```

### 3. Configurar banco de dados PostgreSQL
Certifique-se de que o PostgreSQL está rodando e crie o banco de dados:

```sql
CREATE DATABASE sistema_multi_empresa;
```

### 4. Executar migrations
```bash
npm run migration:run
```

### 5. Compilar o projeto
```bash
npm run build
```

### 6. Iniciar o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 API Endpoints

Todos os endpoints seguem o padrão REST com CRUD completo:

### Padrão de Endpoints
```
GET    /api/{resource}     - Listar com paginação e filtros
GET    /api/{resource}/:id - Buscar por ID
POST   /api/{resource}     - Criar novo
PUT    /api/{resource}/:id - Atualizar
DELETE /api/{resource}/:id - Excluir
```

### Recursos Disponíveis
- `/api/users` - Usuários
- `/api/empresas` - Empresas
- `/api/jwt-tokens` - Tokens JWT
- `/api/usuario-empresas` - Usuário-Empresa
- `/api/roles` - Papéis
- `/api/funcionarios` - Funcionários
- `/api/funcionario-contratos` - Contratos
- `/api/funcionario-beneficio-descontos` - Benefícios/Descontos
- `/api/tarefa-tipos` - Tipos de Tarefa
- `/api/tarefas` - Tarefas
- `/api/tarefa-funcionario-status` - Status de Tarefas
- `/api/tarefa-funcionario-status-historias` - Histórico de Status
- `/api/tarefa-historias` - Histórico de Tarefas
- `/api/contas` - Contas Financeiras
- `/api/centro-custos` - Centros de Custo
- `/api/terceiros` - Terceiros
- `/api/transacao-financeiras` - Transações Financeiras
- `/api/transacao-centro-custos` - Transação-Centro de Custo
- `/api/emprestimos` - Empréstimos
- `/api/pedido-compras` - Pedidos de Compra

### Funcionalidades dos Endpoints
- **Listagem**: Paginação, ordenação e filtros
- **Busca**: Por ID com validação
- **Criação**: Com validação de dados
- **Atualização**: Parcial com validação
- **Exclusão**: Com confirmação (soft delete quando aplicável)

### Exemplo de Resposta
```json
{
  "success": true,
  "message": "Listagem realizada com sucesso",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor em modo desenvolvimento

# Build
npm run build           # Compila TypeScript para JavaScript

# Produção
npm start              # Inicia servidor compilado

# Migrations
npm run migration:generate  # Gera nova migration
npm run migration:run      # Executa migrations pendentes
npm run migration:revert   # Reverte última migration
npm run migration:show     # Mostra status das migrations

# Schema
npm run schema:sync    # Sincroniza schema (cuidado em produção)
npm run schema:drop    # Remove schema (cuidado!)

# Qualidade de Código
npm run lint           # Verificar código
npm run lint:fix       # Corrigir problemas de lint
```

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas bem definida:

### Camadas
1. **Controllers** - Recebem requisições HTTP e delegam para services
2. **Services** - Contêm lógica de negócio e validações
3. **Repositories** - Acesso a dados e queries específicas
4. **Entities** - Modelos de dados do TypeORM
5. **DTOs** - Objetos de transferência de dados com validação
6. **Mappers** - Conversão entre DTOs e Entities

### Padrões Utilizados
- **Repository Pattern** - Abstração da camada de dados
- **Service Layer** - Lógica de negócio centralizada
- **DTO Pattern** - Validação e transferência de dados
- **Mapper Pattern** - Conversão entre camadas
- **Dependency Injection** - Inversão de controle

## 🔒 Segurança

- **Helmet** - Headers de segurança HTTP
- **CORS** - Configuração de origens permitidas
- **Validação** - Validação rigorosa de entrada de dados
- **Hash de Senhas** - bcryptjs para hash seguro
- **JWT** - Autenticação baseada em tokens
- **SQL Injection** - Proteção via TypeORM

## 📊 Monitoramento

- **Health Check** - Endpoint `/health` para verificação de status
- **Logging** - Morgan para logs HTTP
- **Error Handling** - Tratamento centralizado de erros

## 🚀 Deploy

O projeto está configurado para deploy em qualquer ambiente que suporte Node.js:

1. Configure as variáveis de ambiente
2. Execute `npm run build`
3. Execute `npm run migration:run`
4. Execute `npm start`

## 📝 Licença

MIT

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

