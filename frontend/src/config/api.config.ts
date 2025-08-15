export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      forgotPassword: '/api/auth/forgot-password',
      resetPassword: '/api/auth/reset-password',
      profile: '/api/auth/profile',
      validate: '/api/auth/validate',
    },
    empresas: '/api/empresas',
    funcionarios: '/api/funcionarios',
    tarefas: '/api/tarefas',
    financeiro: '/api/transacao-financeiras',
    compras: '/api/pedido-compras',
  },
};

export const ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  
  // Empresas
  empresas: '/empresas',
  usuarioEmpresas: '/usuario-empresas',
  
  // Funcionários
  funcionarios: '/funcionarios',
  funcionarioContratos: '/funcionario-contratos',
  funcionarioBeneficioDescontos: '/funcionario-beneficio-descontos',
  
  // Tarefas
  tarefas: '/tarefas',
  tarefaTipos: '/tarefa-tipos',
  tarefaFuncionarioStatus: '/tarefa-funcionario-status',
  
  // Financeiro
  contas: '/contas',
  centroCustos: '/centro-custos',
  terceiros: '/terceiros',
  transacaoFinanceiras: '/transacao-financeiras',
  emprestimos: '/emprestimos',
  
  // Compras
  pedidoCompras: '/pedido-compras',
  
  // Usuários e Roles
  users: '/users',
  roles: '/roles',
};
