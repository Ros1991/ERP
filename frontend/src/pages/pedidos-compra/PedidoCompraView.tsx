import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import pedidoCompraService from '../../services/compras/pedidoCompra.service';
import type { PedidoCompra } from '@/models/compras/PedidoCompra.model';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, FileText, Building2, DollarSign, Calendar, User, Loader2 } from 'lucide-react';

const PedidoCompraView: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id: string }>();
  const [pedido, setPedido] = useState<PedidoCompra | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPedido();
  }, [empresaId, id]);

  const loadPedido = async () => {
    if (!empresaId || !id) return;
    try {
      setLoading(true);
      const data = await pedidoCompraService.getById(parseInt(empresaId), parseInt(id));
      setPedido(data);
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
      toast.error('Erro ao carregar pedido');
      navigate(`/empresas/${empresaId}/pedidos-compra`);
    } finally {
      setLoading(false);
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
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando pedido de compra...</span>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Pedido não encontrado</div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button onClick={() => navigate(`/empresas/${empresaId}/pedidos-compra`)} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para lista
        </button>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Detalhes do Pedido de Compra</h1>
          <button onClick={() => navigate(`/empresas/${empresaId}/pedidos-compra/${id}/editar`)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Editar</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-4xl">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Informações do Pedido</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-start text-gray-600">
            <FileText className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
            <div>
              <span className="font-medium text-gray-700">Descrição:</span>
              <p className="ml-0 mt-1 text-gray-600">{pedido.descricao}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center text-gray-600">
              <Building2 className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Fornecedor:</span>
                <span className="ml-2">{pedido.terceiroId ? `Terceiro ${pedido.terceiroId}` : '-'}</span>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Building2 className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Centro de Custo:</span>
                <span className="ml-2">{pedido.centroCustoId ? `Centro ${pedido.centroCustoId}` : '-'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Valor Estimado:</span>
                <span className="ml-2 text-lg font-semibold text-green-600">
                  {pedido.valorEstimado 
                    ? `R$ ${pedido.valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : 'Não informado'}
                </span>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <div className="mt-1">{getStatusBadge(pedido.status)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Data do Pedido:</span>
                <span className="ml-2">
                  {new Date(pedido.dataSolicitacao).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Data de Necessidade:</span>
                <span className="ml-2">
                  {new Date(pedido.dataSolicitacao).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <User className="h-5 w-5 mr-3 text-gray-400" />
            <div>
              <span className="font-medium text-gray-700">Solicitante:</span>
              <span className="ml-2">{pedido.usuarioEmpresaSolicitanteId ? `Usuário ${pedido.usuarioEmpresaSolicitanteId}` : '-'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Criado em:</span>
                <span className="ml-2">
                  {new Date(pedido.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Última atualização:</span>
                <span className="ml-2">
                  {new Date(pedido.updatedAt).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoCompraView;
