export interface PedidoCompra {
  pedidoId: number;
  empresaId: number;
  terceiroId?: number;
  usuarioEmpresaSolicitanteId: number;
  centroCustoId?: number;
  descricao: string;
  valorEstimado?: number;
  dataSolicitacao: string;
  status: 'PENDENTE' | 'APROVADO' | 'COMPRADO' | 'CANCELADO';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePedidoCompraDTO {
  empresaId: number;
  terceiroId?: number;
  usuarioEmpresaSolicitanteId: number;
  centroCustoId?: number;
  descricao: string;
  valorEstimado?: number;
  dataSolicitacao: string;
  status?: 'PENDENTE' | 'APROVADO' | 'COMPRADO' | 'CANCELADO';
}

export interface UpdatePedidoCompraDTO extends Partial<CreatePedidoCompraDTO> {}
