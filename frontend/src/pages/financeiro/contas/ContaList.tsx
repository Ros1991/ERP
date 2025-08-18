import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, DollarSign, Building2, User, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import contaService, { type PaginatedResponse } from '../../../services/financeiro/conta.service';
import type { Conta } from '../../../models/financeiro/Conta.model';
import { useConfirmDialog } from '../../../components/ui/ConfirmDialog';

export default function ContaList() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const navigate = useNavigate();
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const { ConfirmDialog, showConfirm } = useConfirmDialog();

  useEffect(() => {
    if (empresaId) {
      loadContas();
    }
  }, [empresaId, pagination.page]);

  const loadContas = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Conta> = await contaService.getAll(
        Number(empresaId),
        pagination.page,
        pagination.limit
      );
      setContas(response.data);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      console.error('Error loading contas:', error);
      toast.error('Erro ao carregar contas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (conta: Conta) => {
    showConfirm({
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a conta "${conta.nome}"? Esta ação não pode ser desfeita.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await contaService.delete(Number(empresaId), conta.contaId);
          toast.success('Conta excluída com sucesso');
          loadContas();
        } catch (error) {
          console.error('Error deleting conta:', error);
          toast.error('Erro ao excluir conta');
        }
      }
    });
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'SOCIO': return <User className="h-5 w-5" />;
      case 'EMPRESA': return <Building2 className="h-5 w-5" />;
      case 'BANCO': return <DollarSign className="h-5 w-5" />;
      case 'CAIXA': return <Wallet className="h-5 w-5" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'SOCIO': return 'bg-purple-100 text-purple-800';
      case 'EMPRESA': return 'bg-blue-100 text-blue-800';
      case 'BANCO': return 'bg-green-100 text-green-800';
      case 'CAIXA': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
        <h1 className="text-2xl font-bold text-gray-900">Contas</h1>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/contas/nova`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nova Conta
        </button>
      </div>

      {contas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Nenhuma conta cadastrada
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo
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
                {contas.map((conta) => (
                  <tr key={conta.contaId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(conta.tipo)}`}>
                          {getTipoIcon(conta.tipo)}
                          {conta.tipo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{conta.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${conta.saldoInicial >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(conta.saldoInicial)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                        conta.ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {conta.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/empresas/${empresaId}/contas/${conta.contaId}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/empresas/${empresaId}/contas/${conta.contaId}/editar`)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(conta)}
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
      
      <ConfirmDialog />
    </div>
  );
}
