import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
// import { Card } from '../../components/ui/Card';
// import { Badge } from '../../components/ui/Badge';
import { funcionarioService } from '../../services/funcionario/funcionario.service';
import type { Funcionario } from '../../models/funcionario/Funcionario.model';
import type { PaginatedResponse } from '../../types/common.types';

export function FuncionarioList() {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    loadFuncionarios();
  }, [currentPage, searchTerm, companyId]);

  const loadFuncionarios = async () => {
    if (!companyId) return;
    
    setLoading(true);
    try {
      const response: PaginatedResponse<Funcionario> = await funcionarioService.getAll(
        companyId,
        {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          sortBy: 'nome',
          sortOrder: 'asc',
        }
      );

      setFuncionarios(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast.error('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (funcionarioId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      return;
    }
    
    try {
      await funcionarioService.delete(companyId!, String(funcionarioId));
      toast.success('Funcionário excluído com sucesso!');
      loadFuncionarios();
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      toast.error('Erro ao excluir funcionário');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadFuncionarios();
  };

  const formatCPF = (cpf: string | undefined) => {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Funcionários</h1>
              <p className="text-sm text-gray-600">
                Gerencie os funcionários da empresa
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate(`/dashboard/${companyId}/funcionarios/novo`)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Funcionário
          </Button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por nome, CPF, cargo ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
        </form>
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        Mostrando {funcionarios.length} de {totalItems} funcionários
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : funcionarios.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum funcionário encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Tente ajustar sua busca ou filtros'
              : 'Comece cadastrando o primeiro funcionário'}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => navigate(`/dashboard/${companyId}/funcionarios/novo`)}
              className="mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Funcionário
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funcionário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Identificação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nascimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endereço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {funcionarios.map((funcionario) => (
                    <tr key={funcionario.funcionarioId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {funcionario.nome || funcionario.apelido}
                          </div>
                          <div className="text-xs text-gray-500">
                            CPF: {formatCPF(funcionario.cpf)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {funcionario.email && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Mail className="h-3 w-3" />
                              {funcionario.email}
                            </div>
                          )}
                          {funcionario.telefone && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="h-3 w-3" />
                              {funcionario.telefone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            Apelido: {funcionario.apelido}
                          </div>
                          {funcionario.rg && (
                            <div className="text-gray-500">
                              RG: {funcionario.rg}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {formatDate(funcionario.dataNascimento!)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {funcionario.endereco || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          funcionario.ativo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {funcionario.ativo ? (
                            <>
                              <UserCheck className="h-3 w-3" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3" />
                              Inativo
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionario.funcionarioId}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionario.funcionarioId}/editar`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(funcionario.funcionarioId)}
                            className="text-red-600 hover:text-red-900"
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
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
