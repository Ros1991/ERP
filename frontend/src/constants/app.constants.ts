export const APP_CONFIG = {
  name: 'ERP System',
  version: '1.0.0',
  description: 'Sistema ERP Multi-empresa',
  company: 'Sua Empresa',
};

export const PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
};

export const DATE_FORMATS = {
  display: 'dd/MM/yyyy',
  displayDateTime: 'dd/MM/yyyy HH:mm',
  api: 'yyyy-MM-dd',
  apiDateTime: "yyyy-MM-dd'T'HH:mm:ss",
};

export const STORAGE_KEYS = {
  token: '@erp:token',
  user: '@erp:user',
  empresa: '@erp:empresa',
  theme: '@erp:theme',
  language: '@erp:language',
};

export const QUERY_KEYS = {
  // Auth
  user: ['user'],
  
  // Empresas
  empresas: ['empresas'],
  empresa: (id: number) => ['empresa', id],
  
  // Funcionários
  funcionarios: ['funcionarios'],
  funcionario: (id: number) => ['funcionario', id],
  funcionarioContratos: (funcionarioId: number) => ['funcionario-contratos', funcionarioId],
  
  // Tarefas
  tarefas: ['tarefas'],
  tarefa: (id: number) => ['tarefa', id],
  tarefaTipos: ['tarefa-tipos'],
  
  // Financeiro
  contas: ['contas'],
  conta: (id: number) => ['conta', id],
  centroCustos: ['centro-custos'],
  terceiros: ['terceiros'],
  transacoes: ['transacoes'],
  
  // Compras
  pedidoCompras: ['pedido-compras'],
  pedidoCompra: (id: number) => ['pedido-compra', id],
};
