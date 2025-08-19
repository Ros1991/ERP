import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, User, Search } from 'lucide-react';
import { userService } from '../../services/auth/auth.service';
import type { User as UserType } from '../../models/auth/User.model';
import toast from 'react-hot-toast';

export default function UsuarioList() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<UserType[]>([]);
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

  const loadUsuarios = useCallback(async (isSearching = false) => {
    try {
      if (isSearching) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }
      
      const response = await userService.getAll(
        pagination.page, 
        pagination.limit, 
        debouncedSearchTerm
      );
      setUsuarios(response.data);
      setPagination(prev => ({ 
        ...prev, 
        total: response.total 
      }));
    } catch (error) {
      console.error('Error loading usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearchTerm]);

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

  // Load data when pagination or search changes
  useEffect(() => {
    loadUsuarios(!!debouncedSearchTerm);
  }, [loadUsuarios]);

  // Reset to first page when search changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) return;
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearchTerm, searchTerm]);

  const handleDelete = async (usuario: UserType) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${usuario.nome}"?`)) {
      try {
        await userService.delete(usuario.userId);
        toast.success('Usuário excluído com sucesso');
        loadUsuarios();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        toast.error('Erro ao excluir usuário');
      }
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/usuarios/novo`)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {usuarios.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            {debouncedSearchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
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
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Criação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.userId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{usuario.nome}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{usuario.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/empresas/${empresaId}/usuarios/${usuario.userId}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Visualizar"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/empresas/${empresaId}/usuarios/${usuario.userId}/editar`)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Editar"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(usuario)}
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
    </div>
  );
}
