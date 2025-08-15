export interface PedidoCompra {
  pedidoCompraId: number;
  empresaId: number;
  terceiroId: number;
  numero: string;
  data: string;
  prazoEntrega?: string;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO' | 'ENTREGUE' | 'CANCELADO';
  valorTotal: number;
  observacao?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePedidoCompraDTO {
  empresaId: number;
  terceiroId: number;
  numero: string;
  data: string;
  prazoEntrega?: string;
  status?: 'PENDENTE' | 'APROVADO' | 'RECUSADO' | 'ENTREGUE' | 'CANCELADO';
  valorTotal: number;
  observacao?: string;
}

export interface UpdatePedidoCompraDTO extends Partial<CreatePedidoCompraDTO> {}
