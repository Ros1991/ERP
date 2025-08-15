export interface PedidoCompra {
  id: number;
  empresaId: number;
  fornecedorId: number;
  numeroPedido: string;
  dataPedido: string;
  dataEntregaPrevista?: string;
  dataEntregaRealizada?: string;
  status: 'RASCUNHO' | 'APROVADO' | 'ENVIADO' | 'RECEBIDO_PARCIAL' | 'RECEBIDO' | 'CANCELADO';
  valorTotal: number;
  desconto?: number;
  valorFrete?: number;
  observacoes?: string;
  aprovadoPor?: number;
  dataAprovacao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PedidoCompraItem {
  id: number;
  pedidoCompraId: number;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  observacoes?: string;
}

export interface CreatePedidoCompraDTO {
  empresaId: number;
  fornecedorId: number;
  dataPedido: string;
  dataEntregaPrevista?: string;
  itens: CreatePedidoCompraItemDTO[];
  desconto?: number;
  valorFrete?: number;
  observacoes?: string;
}

export interface CreatePedidoCompraItemDTO {
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  observacoes?: string;
}

export interface UpdatePedidoCompraDTO extends Partial<Omit<CreatePedidoCompraDTO, 'itens'>> {
  status?: 'RASCUNHO' | 'APROVADO' | 'ENVIADO' | 'RECEBIDO_PARCIAL' | 'RECEBIDO' | 'CANCELADO';
  dataEntregaRealizada?: string;
  aprovadoPor?: number;
  dataAprovacao?: string;
}
