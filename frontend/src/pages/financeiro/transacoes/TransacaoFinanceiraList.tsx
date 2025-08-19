import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, TrendingUp, TrendingDown, DollarSign, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import transacaoFinanceiraService from '../../../services/financeiro/transacaoFinanceira.service';
import type { TransacaoFinanceira } from '../../../models/financeiro/TransacaoFinanceira.model';
import { useConfirmDialog } from '../../../components/ui/ConfirmDialog';

export default function TransacaoFinanceiraList() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const navigate = useNavigate();
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const { ConfirmDialog, showConfirm } = useConfirmDialog();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (empresaId) {
      loadTransacoes();
    }
  }, [empresaId, page, debouncedSearch]);

  const loadTransacoes = async () => {
    try {
      setLoading(true);
      const response = await transacaoFinanceiraService.getAll(Number(empresaId), page, limit, debouncedSearch || undefined);
      setTransacoes(response.data);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (error) {
      console.error('Error loading transações:', error);
      toast.error('Erro ao carregar transações financeiras');
    } finally {
      setLoading(false);
    }
  };

  const deleteTransacao = async (transacao: TransacaoFinanceira) => {
    showConfirm({
      title: 'Excluir Transação Financeira',
      message: `Tem certeza que deseja excluir a transação "${transacao.descricao}"?`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          setLoading(true);
          await transacaoFinanceiraService.delete(Number(empresaId), transacao.transacaoId);
          toast.success('Transação financeira excluída com sucesso');
          loadTransacoes();
        } catch (error) {
          console.error('Error deleting transação:', error);
          toast.error('Erro ao excluir transação financeira');
        } finally {
          setLoading(false);
        }
      }
    });
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

  const getTipoIcon = (tipo: string) => {
    return tipo === 'RECEITA' ? 
      <TrendingUp className="h-5 w-5 text-green-600" /> : 
      <TrendingDown className="h-5 w-5 text-red-600" />;
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600';
  };

  if (loading && transacoes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transações Financeiras</h1>
          <p className="text-gray-600">Gerencie receitas e despesas da empresa</p>
        </div>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/transacoes-financeiras/nova`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nova Transação
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar transações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transacoes.map((transacao) => (
              <tr key={transacao.transacaoId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getTipoIcon(transacao.tipo)}
                    <span className={`font-medium ${getTipoColor(transacao.tipo)}`}>
                      {transacao.tipo}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transacao.dataTransacao)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate">{transacao.descricao}</div>
                  {transacao.observacoes && (
                    <div className="text-xs text-gray-500 truncate">{transacao.observacoes}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className={`font-bold ${getTipoColor(transacao.tipo)}`}>
                      {formatCurrency(transacao.valor)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/empresas/${empresaId}/transacoes-financeiras/${transacao.transacaoId}`)}
                      className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/empresas/${empresaId}/transacoes-financeiras/${transacao.transacaoId}/editar`)}
                      className="p-1 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTransacao(transacao)}
                      className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
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

        {transacoes.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma transação financeira encontrada</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Página <span className="font-medium">{page}</span> de{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog />
    </div>
  );
}
