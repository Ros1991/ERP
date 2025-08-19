import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Search, Loader2 } from 'lucide-react';
import { emprestimoService } from '../../../services/financeiro/emprestimo.service';
import type { Emprestimo } from '../../../models/financeiro/Emprestimo.model';
import toast from 'react-hot-toast';

const EmprestimoList: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId } = useParams<{ empresaId: string }>();
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (empresaId) {
      loadEmprestimos();
    }
  }, [empresaId, currentPage, debouncedSearch, statusFilter]);

  const loadEmprestimos = async () => {
    if (!empresaId) return;
    try {
      setLoading(true);
      const response = await emprestimoService.getAll(parseInt(empresaId), currentPage, itemsPerPage, debouncedSearch);
      setEmprestimos(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error);
      toast.error('Erro ao carregar empréstimos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async (emprestimo: Emprestimo) => {
    if (!empresaId) return;
    
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o empréstimo de ${emprestimo.funcionario?.nome || 'N/A'}?`
    );
    
    if (!confirmed) return;
    
    try {
      await emprestimoService.delete(parseInt(empresaId), emprestimo.emprestimoId);
      toast.success('Empréstimo excluído com sucesso');
      loadEmprestimos();
    } catch (error) {
      console.error('Erro ao excluir empréstimo:', error);
      toast.error('Erro ao excluir empréstimo');
    }
  }, [empresaId]);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'ATIVO': 'bg-blue-100 text-blue-800',
      'QUITADO': 'bg-green-100 text-green-800',
      'VENCIDO': 'bg-red-100 text-red-800',
      'CANCELADO': 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading && emprestimos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando empréstimos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empréstimos</h1>
          <p className="text-gray-600 mt-1">Gerencie os empréstimos para funcionários</p>
        </div>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/emprestimos/novo`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          Novo Empréstimo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por funcionário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
            >
              <option value="">Todos os Status</option>
              <option value="ATIVO">Ativo</option>
              <option value="QUITADO">Quitado</option>
              <option value="VENCIDO">Vencido</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Empréstimo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Carregando...</span>
                    </div>
                  </td>
                </tr>
              ) : emprestimos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum empréstimo encontrado
                  </td>
                </tr>
              ) : (
                emprestimos.map((emprestimo) => (
                  <tr key={emprestimo.emprestimoId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {emprestimo.funcionario?.nome || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(emprestimo.valorTotal)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(emprestimo.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(emprestimo.dataEmprestimo).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/empresas/${empresaId}/emprestimos/${emprestimo.emprestimoId}`)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/empresas/${empresaId}/emprestimos/${emprestimo.emprestimoId}/editar`)}
                          className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emprestimo)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmprestimoList;
