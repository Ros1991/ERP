import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import centroCustoService from '../../../services/financeiro/centroCusto.service';
import type { CentroCusto } from '../../../models/financeiro/CentroCusto.model';
import { useConfirmDialog } from '../../../components/ui/ConfirmDialog';

export default function CentroCustoList() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const navigate = useNavigate();
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const { ConfirmDialog, showConfirm } = useConfirmDialog();

  useEffect(() => {
    if (empresaId) {
      loadCentrosCusto();
    }
  }, [empresaId, page]);

  const loadCentrosCusto = async () => {
    try {
      setLoading(true);
      const response = await centroCustoService.getAll(Number(empresaId), page, limit);
      setCentrosCusto(response.data);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (error) {
      console.error('Error loading centros de custo:', error);
      toast.error('Erro ao carregar centros de custo');
    } finally {
      setLoading(false);
    }
  };

  const deleteCentroCusto = async (centroCusto: CentroCusto) => {
    showConfirm({
      title: 'Excluir Centro de Custo',
      message: `Tem certeza que deseja excluir o centro de custo "${centroCusto.nome}"?`,
      variant: 'danger',
      onConfirm: async () => {

        try {
          setLoading(true);
          await centroCustoService.delete(Number(empresaId), centroCusto.centroCustoId);
          toast.success('Centro de custo excluído com sucesso!');
          loadCentrosCusto();
        } catch (error) {
          console.error('Erro ao excluir centro de custo:', error);
          toast.error('Erro ao excluir centro de custo');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (loading && centrosCusto.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Centros de Custo</h1>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/centros-custo/novo`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Novo Centro de Custo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Centro de Custo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
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
            {centrosCusto.map((centro) => (
              <tr key={centro.centroCustoId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{centro.nome}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="max-w-xs truncate">
                    {centro.descricao || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    centro.ativo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {centro.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/empresas/${empresaId}/centros-custo/${centro.centroCustoId}`)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Visualizar"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/empresas/${empresaId}/centros-custo/${centro.centroCustoId}/editar`)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteCentroCusto(centro)}
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

        {centrosCusto.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum centro de custo encontrado</p>
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
