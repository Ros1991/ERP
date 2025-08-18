import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, User, Building, Users, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import terceiroService, { type PaginatedResponse } from '../../../services/financeiro/terceiro.service';
import type { Terceiro } from '../../../models/financeiro/Terceiro.model';
import { useConfirmDialog } from '../../../components/ui/ConfirmDialog';

export default function TerceiroList() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const navigate = useNavigate();
  const [terceiros, setTerceiros] = useState<Terceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const { ConfirmDialog, showConfirm } = useConfirmDialog();
  const debounceTimeoutRef = useRef<number | null>(null);

  const loadTerceiros = useCallback(async (isSearching = false) => {
    try {
      if (isSearching) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }
      
      const response: PaginatedResponse<Terceiro> = await terceiroService.getAll(
        Number(empresaId),
        pagination.page,
        pagination.limit,
        debouncedSearchTerm || undefined
      );
      setTerceiros(response.data);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      console.error('Error loading terceiros:', error);
      toast.error('Erro ao carregar terceiros');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [empresaId, pagination.page, pagination.limit, debouncedSearchTerm]);

  // Debounce effect for search
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Load data when debounced search term changes
  useEffect(() => {
    if (empresaId) {
      const isSearching = debouncedSearchTerm !== '';
      loadTerceiros(isSearching);
    }
  }, [empresaId, debouncedSearchTerm, pagination.page, loadTerceiros]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Reset to first page when searching
    if (value !== searchTerm) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const handleDelete = async (terceiro: Terceiro) => {
    showConfirm({
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o terceiro "${terceiro.nome}"? Esta ação não pode ser desfeita.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await terceiroService.delete(Number(empresaId), terceiro.terceiroId);
          toast.success('Terceiro excluído com sucesso');
          loadTerceiros();
        } catch (error) {
          console.error('Error deleting terceiro:', error);
          toast.error('Erro ao excluir terceiro');
        }
      }
    });
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'CLIENTE': return <User className="h-5 w-5" />;
      case 'FORNECEDOR': return <Building className="h-5 w-5" />;
      case 'AMBOS': return <Users className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'CLIENTE': return 'bg-blue-100 text-blue-800';
      case 'FORNECEDOR': return 'bg-orange-100 text-orange-800';
      case 'AMBOS': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDocument = (doc?: string) => {
    if (!doc) return '-';
    
    // Remove non-numeric characters
    const numbers = doc.replace(/\D/g, '');
    
    if (numbers.length === 11) {
      // Format CPF: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numbers.length === 14) {
      // Format CNPJ: 00.000.000/0000-00
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    // Return as is if doesn't match CPF or CNPJ format
    return doc;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Terceiros</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Campo de busca */}
          <div className="relative flex-1 sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, tipo ou CNPJ/CPF..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {searchLoading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate(`/empresas/${empresaId}/terceiros/novo`)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Novo Terceiro
          </button>
        </div>
      </div>

      {terceiros.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Nenhum terceiro cadastrado
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
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
                {terceiros.map((terceiro) => (
                  <tr key={terceiro.terceiroId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{terceiro.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(terceiro.tipo)}`}>
                        {getTipoIcon(terceiro.tipo)}
                        {terceiro.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDocument(terceiro.cnpjCpf)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {terceiro.email && <div>{terceiro.email}</div>}
                        {terceiro.telefone && <div>{terceiro.telefone}</div>}
                        {!terceiro.email && !terceiro.telefone && <span className="text-gray-400">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                        terceiro.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {terceiro.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/empresas/${empresaId}/terceiros/${terceiro.terceiroId}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/empresas/${empresaId}/terceiros/${terceiro.terceiroId}/editar`)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(terceiro)}
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
