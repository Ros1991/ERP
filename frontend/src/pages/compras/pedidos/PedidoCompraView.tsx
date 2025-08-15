import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Package, Calendar, DollarSign, Clock, AlertCircle, CheckCircle, XCircle, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import pedidoCompraService from '@/services/compras/pedidoCompra.service';
import terceiroService from '@/services/financeiro/terceiro.service';
import { PedidoCompra } from '@/models/compras/PedidoCompra.model';
import { Terceiro } from '@/models/financeiro/Terceiro.model';

export default function PedidoCompraView() {
  const { empresaId, pedidoCompraId } = useParams<{ empresaId: string; pedidoCompraId: string }>();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<PedidoCompra | null>(null);
  const [fornecedor, setFornecedor] = useState<Terceiro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId && pedidoCompraId) {
      loadPedidoCompra();
    }
  }, [empresaId, pedidoCompraId]);

  const loadPedidoCompra = async () => {
    try {
      setLoading(true);
      const data = await pedidoCompraService.getById(Number(empresaId), Number(pedidoCompraId));
      setPedido(data);
      
      // Load fornecedor details
      if (data.terceiroId) {
        try {
          const fornecedorData = await terceiroService.getById(Number(empresaId), data.terceiroId);
          setFornecedor(fornecedorData);
        } catch (error) {
          console.error('Error loading fornecedor:', error);
        }
      }
    } catch (error) {
      console.error('Error loading pedido:', error);
      toast.error('Erro ao carregar pedido de compra');
      navigate(`/empresas/${empresaId}/pedidos-compra`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDENTE': return <AlertCircle className="h-6 w-6" />;
      case 'APROVADO': return <CheckCircle className="h-6 w-6" />;
      case 'RECUSADO': return <XCircle className="h-6 w-6" />;
      case 'ENTREGUE': return <Truck className="h-6 w-6" />;
      case 'CANCELADO': return <XCircle className="h-6 w-6" />;
      default: return <AlertCircle className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-800';
      case 'APROVADO': return 'bg-green-100 text-green-800';
      case 'RECUSADO': return 'bg-red-100 text-red-800';
      case 'ENTREGUE': return 'bg-blue-100 text-blue-800';
      case 'CANCELADO': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Pedido de compra não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Detalhes do Pedido de Compra</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/pedidos-compra`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <button
            onClick={() => navigate(`/empresas/${empresaId}/pedidos-compra/${pedidoCompraId}/editar`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="h-5 w-5" />
            Editar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          {/* Header com número e status */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-gray-400" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{pedido.numero}</h2>
                <p className="text-sm text-gray-500">Pedido de Compra</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(pedido.status)}`}>
              {getStatusIcon(pedido.status)}
              {pedido.status}
            </span>
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fornecedor</h3>
              {fornecedor ? (
                <div>
                  <p className="text-lg font-semibold text-gray-900">{fornecedor.nome}</p>
                  <p className="text-sm text-gray-600">{fornecedor.documento}</p>
                  {fornecedor.email && <p className="text-sm text-gray-600">{fornecedor.email}</p>}
                  {fornecedor.telefone && <p className="text-sm text-gray-600">{fornecedor.telefone}</p>}
                </div>
              ) : (
                <p className="text-lg text-gray-900">ID: {pedido.terceiroId}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Valor Total</h3>
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(pedido.valorTotal)}</p>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <span className="text-sm text-gray-500">Data do Pedido:</span>
                <p className="text-gray-900 font-medium">{formatDate(pedido.data)}</p>
              </div>
            </div>

            {pedido.prazoEntrega && (
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Prazo de Entrega:</span>
                  <p className="text-gray-900 font-medium">{formatDate(pedido.prazoEntrega)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          {pedido.observacao && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Observações</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{pedido.observacao}</p>
              </div>
            </div>
          )}

          {/* Informações de auditoria */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Registro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Criado em: {formatDateTime(pedido.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Atualizado em: {formatDateTime(pedido.updatedAt)}</span>
              </div>
              {pedido.isDeleted && pedido.deletedAt && (
                <div className="flex items-center gap-2 text-sm text-red-600 md:col-span-2">
                  <XCircle className="h-4 w-4" />
                  <span>Excluído em: {formatDateTime(pedido.deletedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
