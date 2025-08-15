import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Package, Calendar, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import pedidoCompraService, { PaginatedResponse } from '@/services/compras/pedidoCompra.service';
import { PedidoCompra } from '@/models/compras/PedidoCompra.model';

export default function PedidoCompraList() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    if (empresaId) {
      loadPedidos();
    }
  }, [empresaId, pagination.page]);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<PedidoCompra> = await pedidoCompraService.getAll(
        Number(empresaId),
        pagination.page,
        pagination.limit
      );
      setPedidos(response.data);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      console.error('Error loading pedidos:', error);
      toast.error('Erro ao carregar pedidos de compra');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pedidoCompraId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este pedido de compra?')) {
      return;
    }

    try {
      await pedidoCompraService.delete(Number(empresaId), pedidoCompraId);
      toast.success('Pedido de compra excluído com sucesso');
      loadPedidos();
    } catch (error) {
      console.error('Error deleting pedido:', error);
      toast.error('Erro ao excluir pedido de compra');
    }
  };

  const handleStatusChange = async (pedidoCompraId: number, newStatus: string) => {
    try {
      await pedidoCompraService.updateStatus(Number(empresaId), pedidoCompraId, newStatus);
      toast.success('Status atualizado com sucesso');
      loadPedidos();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status');
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

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos de Compra</h1>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/pedidos-compra/novo`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Novo Pedido
        </button>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Nenhum pedido de compra cadastrado
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prazo Entrega
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedidos.map((pedido) => (
                  <tr key={pedido.pedidoCompraId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{pedido.numero}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(pedido.data)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {pedido.prazoEntrega ? formatDate(pedido.prazoEntrega) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        {formatCurrency(pedido.valorTotal)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={pedido.status}
                        onChange={(e) => handleStatusChange(pedido.pedidoCompraId, e.target.value)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${getStatusColor(pedido.status)}`}
                      >
                        <option value="PENDENTE">PENDENTE</option>
                        <option value="APROVADO">APROVADO</option>
                        <option value="RECUSADO">RECUSADO</option>
                        <option value="ENTREGUE">ENTREGUE</option>
                        <option value="CANCELADO">CANCELADO</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/empresas/${empresaId}/pedidos-compra/${pedido.pedidoCompraId}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/empresas/${empresaId}/pedidos-compra/${pedido.pedidoCompraId}/editar`)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(pedido.pedidoCompraId)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: idx + 1 }))}
                  className={`px-3 py-1 rounded-lg ${
                    pagination.page === idx + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === totalPages}
                className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
