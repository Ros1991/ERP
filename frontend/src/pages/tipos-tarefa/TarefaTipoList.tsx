import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Search } from 'lucide-react';
import tarefaTipoService from '../../services/tarefa/tarefaTipo.service';
import type { TarefaTipo } from '../../models/tarefa/TarefaTipo.model';
import toast from 'react-hot-toast';

const TarefaTipoList: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId } = useParams<{ empresaId: string }>();
  const [tipos, setTipos] = useState<TarefaTipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (empresaId) {
      setCurrentPage(1);
      loadTipos();
    }
  }, [empresaId, debouncedSearchTerm]);

  useEffect(() => {
    if (empresaId) {
      loadTipos();
    }
  }, [currentPage]);

  const loadTipos = useCallback(async () => {
    if (!empresaId) return;
    try {
      setLoading(true);
      const response = await tarefaTipoService.getAll(
        parseInt(empresaId), 
        currentPage, 
        itemsPerPage,
        debouncedSearchTerm || undefined
      );
      setTipos(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (error) {
      console.error('Erro ao carregar tipos de tarefa:', error);
      toast.error('Erro ao carregar tipos de tarefa');
    } finally {
      setLoading(false);
    }
  }, [empresaId, currentPage, debouncedSearchTerm]);

  const handleDelete = async (id: number) => {
    if (!empresaId || !window.confirm('Tem certeza que deseja excluir este tipo de tarefa?')) return;
    try {
      await tarefaTipoService.delete(parseInt(empresaId), id);
      toast.success('Tipo de tarefa excluído com sucesso');
      loadTipos();
    } catch (error) {
      console.error('Erro ao excluir tipo de tarefa:', error);
      toast.error('Erro ao excluir tipo de tarefa');
    }
  };

  const getStatusBadge = (ativo: boolean) => {
    return ativo ? (
      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Ativo</span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Inativo</span>
    );
  };

  if (loading && tipos.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Tipos de Tarefa</h1>
          <p className="text-gray-600">Gerencie os tipos de tarefa da empresa</p>
        </div>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/tipos-tarefa/novo`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Novo Tipo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar tipos de tarefa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tipos.map((tipo) => (
                    <tr key={tipo.tipoId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tipo.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-200" 
                            style={{ backgroundColor: tipo.cor || '#6B7280' }}
                          ></div>
                          <span className="text-sm text-gray-600">{tipo.cor || '#6B7280'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(tipo.ativo)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => navigate(`/empresas/${empresaId}/tipos-tarefa/${tipo.tipoId}`)} 
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => navigate(`/empresas/${empresaId}/tipos-tarefa/${tipo.tipoId}/editar`)} 
                            className="p-2 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors" 
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(tipo.tipoId)} 
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors" 
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
              
              {tipos.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">Nenhum tipo de tarefa encontrado</div>
                  {debouncedSearchTerm && (
                    <p className="text-gray-400 text-sm mt-2">
                      Tente ajustar os filtros de busca
                    </p>
                  )}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
                </div>
                <div className="flex items-center gap-2">
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
          </>
        )}
      </div>
    </div>
  );
};

export default TarefaTipoList;
