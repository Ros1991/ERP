import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Search, Loader2 } from 'lucide-react';
import pedidoCompraService from '../../services/compras/pedidoCompra.service';
import type { PedidoCompra } from '@/models/compras/PedidoCompra.model';
import toast from 'react-hot-toast';

const PedidoCompraList: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId } = useParams<{ empresaId: string }>();
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (empresaId) {
      loadPedidos();
    }
  }, [empresaId, currentPage, debouncedSearchTerm, statusFilter]);

  const loadPedidos = async () => {
    if (!empresaId) return;
    try {
      setLoading(true);
      const response = await pedidoCompraService.getAll(parseInt(empresaId), currentPage, itemsPerPage, debouncedSearchTerm);
      setPedidos(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (error) {
      console.error('Erro ao carregar pedidos de compra:', error);
      toast.error('Erro ao carregar pedidos de compra');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, descricao: string) => {
    if (!empresaId || !window.confirm(`Tem certeza que deseja excluir o pedido "${descricao}"?`)) return;
    try {
      await pedidoCompraService.delete(parseInt(empresaId), id);
      toast.success('Pedido de compra excluído com sucesso');
      loadPedidos();
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      toast.error('Erro ao excluir pedido');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'PENDENTE': 'bg-yellow-100 text-yellow-800',
      'APROVADO': 'bg-blue-100 text-blue-800',
      'EM_COTACAO': 'bg-purple-100 text-purple-800',
      'COMPRADO': 'bg-green-100 text-green-800',
      'REJEITADO': 'bg-red-100 text-red-800',
      'CANCELADO': 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading && pedidos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando pedidos de compra...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pedidos de Compra</h1>
        <p className="text-gray-600">Gerencie os pedidos de compra da empresa</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Lista de Pedidos</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white min-w-[200px]"
            >
              <option value="">Todos os Status</option>
              <option value="PENDENTE">Pendente</option>
              <option value="APROVADO">Aprovado</option>
              <option value="EM_COTACAO">Em Cotação</option>
              <option value="COMPRADO">Comprado</option>
              <option value="REJEITADO">Rejeitado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
            <button 
              onClick={() => navigate(`/empresas/${empresaId}/pedidos-compra/novo`)} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Pedido</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Carregando pedidos...</span>
              </div>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search className="h-12 w-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-500">Não há pedidos de compra que correspondam aos filtros selecionados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fornecedor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor Estimado</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pedidos.map((pedido) => (
                    <tr key={pedido.pedidoId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{pedido.descricao}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{pedido.terceiroId ? `Terceiro ${pedido.terceiroId}` : '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {pedido.valorEstimado ? `R$ ${pedido.valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(pedido.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(pedido.dataSolicitacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => navigate(`/empresas/${empresaId}/pedidos-compra/${pedido.pedidoId}`)} 
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => navigate(`/empresas/${empresaId}/pedidos-compra/${pedido.pedidoId}/editar`)} 
                            className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors" 
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(pedido.pedidoId, pedido.descricao)} 
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200 gap-4">
              <div className="text-sm text-gray-600">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1} 
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                >
                  Anterior
                </button>
                <span className="px-3 py-2 text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages} 
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PedidoCompraList;
