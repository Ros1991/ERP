import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Search } from 'lucide-react';
import tarefaService from '../../services/tarefa/tarefa.service';
import type { Tarefa } from '../../models/tarefa/Tarefa.model';
import toast from 'react-hot-toast';

const TarefaList: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId } = useParams<{ empresaId: string }>();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const debouncedSetSearch = useCallback((value: string) => {
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cleanup = debouncedSetSearch(searchTerm);
    return cleanup;
  }, [searchTerm, debouncedSetSearch]);

  useEffect(() => {
    if (empresaId) {
      loadTarefas();
    }
  }, [empresaId, currentPage, debouncedSearch, statusFilter]);

  const loadTarefas = async () => {
    if (!empresaId) return;
    try {
      setLoading(true);
      const response = await tarefaService.getAll(parseInt(empresaId), currentPage, itemsPerPage, debouncedSearch);
      setTarefas(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, titulo: string) => {
    if (!empresaId || !window.confirm(`Tem certeza que deseja excluir a tarefa "${titulo}"?`)) return;
    try {
      await tarefaService.delete(parseInt(empresaId), id);
      toast.success('Tarefa excluída com sucesso');
      loadTarefas();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      toast.error('Erro ao excluir tarefa');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'PENDENTE': 'bg-gray-100 text-gray-800',
      'EM_ANDAMENTO': 'bg-blue-100 text-blue-800',
      'CONCLUIDA': 'bg-green-100 text-green-800',
      'CANCELADA': 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading && tarefas.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600">Gerencie as tarefas da empresa</p>
        </div>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/tarefas/nova`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nova Tarefa
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os Status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDA">Concluída</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tarefas.map((tarefa) => (
                  <tr key={tarefa.tarefaId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tarefa.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(tarefa.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tarefa.dataPrazo ? new Date(tarefa.dataPrazo).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/empresas/${empresaId}/tarefas/${tarefa.tarefaId}`)} 
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded" 
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/empresas/${empresaId}/tarefas/${tarefa.tarefaId}/editar`)} 
                          className="p-1 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded" 
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(tarefa.tarefaId, tarefa.titulo)} 
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
            {tarefas.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg font-medium">Nenhuma tarefa encontrada</div>
                <p className="text-sm mt-1">Tente ajustar os filtros ou criar uma nova tarefa</p>
              </div>
            )}
          </div>
        )}

        {totalItems > 0 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
            </div>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1} 
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages} 
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Próximo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TarefaList;
