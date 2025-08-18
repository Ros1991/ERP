export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      profile: '/auth/profile',
      validate: '/auth/validate',
    },
    empresas: '/empresas',
    funcionarios: '/funcionarios',
    tarefas: '/tarefas',
    financeiro: '/transacao-financeiras',
    compras: '/pedido-compras',
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
