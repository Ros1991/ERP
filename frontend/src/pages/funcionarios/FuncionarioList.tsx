import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, User, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { funcionarioService } from '../../services/funcionario/funcionario.service';
import type { Funcionario } from '../../models/funcionario/Funcionario.model';

export default function FuncionarioList() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const debounceTimeoutRef = useRef<number | null>(null);

  const loadFuncionarios = useCallback(async (isSearching = false) => {
    try {
      if (isSearching) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }
      
      const response = await funcionarioService.getAll(
        Number(empresaId), 
        pagination.page, 
        pagination.limit, 
        debouncedSearchTerm
      );
      setFuncionarios(response.data);
      setPagination(prev => ({ 
        ...prev, 
        total: response.total 
      }));
    } catch (error) {
      console.error('Error loading funcionários:', error);
      toast.error('Erro ao carregar funcionários');
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
      loadFuncionarios(isSearching);
    }
  }, [empresaId, debouncedSearchTerm, loadFuncionarios]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Reset to first page when searching
    if (value !== searchTerm) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const handleDelete = async (funcionario: Funcionario) => {
    if (window.confirm(`Tem certeza que deseja excluir o funcionário "${funcionario.nome}"? Esta ação não pode ser desfeita.`)) {
      try {
        await funcionarioService.delete(Number(empresaId), String(funcionario.funcionarioId));
        toast.success('Funcionário excluído com sucesso');
        loadFuncionarios();
      } catch (error) {
        console.error('Error deleting funcionário:', error);
        toast.error('Erro ao excluir funcionário');
      }
    }
  };

  const formatDocument = (doc?: string) => {
    if (!doc) return '-';
    
    // Remove non-numeric characters
    const numbers = doc.replace(/\D/g, '');
    
    if (numbers.length === 11) {
      // Format CPF: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    // Return as is if doesn't match CPF format
    return doc;
  };


  // Pagination calculations
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;

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
        <h1 className="text-2xl font-bold text-gray-900">Funcionários</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Campo de busca */}
          <div className="relative flex-1 sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, apelido ou CPF..."
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
            onClick={() => navigate(`/empresas/${empresaId}/funcionarios/novo`)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Novo Funcionário
          </button>
        </div>
      </div>

      {funcionarios.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          {debouncedSearchTerm ? 'Nenhum funcionário encontrado' : 'Nenhum funcionário cadastrado'}
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
                    Apelido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF
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
                {funcionarios.map((funcionario) => (
                  <tr key={funcionario.funcionarioId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{funcionario.nome}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{funcionario.apelido}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDocument(funcionario.cpf)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {funcionario.email && <div>{funcionario.email}</div>}
                        {funcionario.telefone && <div>{funcionario.telefone}</div>}
                        {!funcionario.email && !funcionario.telefone && <span className="text-gray-400">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                        funcionario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {funcionario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/empresas/${empresaId}/funcionarios/${funcionario.funcionarioId}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/empresas/${empresaId}/funcionarios/${funcionario.funcionarioId}/editar`)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(funcionario)}
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
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Mostrando {startIndex + 1} a {Math.min(endIndex, pagination.total)} de {pagination.total} resultados
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
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
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, totalPages) }))}
                  disabled={pagination.page === totalPages}
                  className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
