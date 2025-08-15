import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import tarefaTipoService from '@/services/tarefa/tarefaTipo.service';
import { TarefaTipo } from '@/models/tarefa/TarefaTipo.model';

export default function TarefaTipoList() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const navigate = useNavigate();
  const [tipos, setTipos] = useState<TarefaTipo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId) {
      loadTipos();
    }
  }, [empresaId]);

  const loadTipos = async () => {
    try {
      setLoading(true);
      const data = await tarefaTipoService.getAll(Number(empresaId));
      setTipos(data);
    } catch (error) {
      console.error('Error loading task types:', error);
      toast.error('Erro ao carregar tipos de tarefa');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tipoId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este tipo de tarefa?')) {
      return;
    }

    try {
      await tarefaTipoService.delete(Number(empresaId), tipoId);
      toast.success('Tipo de tarefa excluído com sucesso');
      loadTipos();
    } catch (error) {
      console.error('Error deleting task type:', error);
      toast.error('Erro ao excluir tipo de tarefa');
    }
  };

  const handleToggleAtivo = async (tipoId: number, currentStatus: boolean) => {
    try {
      await tarefaTipoService.toggleAtivo(Number(empresaId), tipoId, !currentStatus);
      toast.success(`Tipo de tarefa ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`);
      loadTipos();
    } catch (error) {
      console.error('Error toggling task type status:', error);
      toast.error('Erro ao alterar status do tipo de tarefa');
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Tipos de Tarefa</h1>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/tarefa-tipos/novo`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Novo Tipo de Tarefa
        </button>
      </div>

      {tipos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Nenhum tipo de tarefa cadastrado
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gerente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Centro de Custo
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
              {tipos.map((tipo) => (
                <tr key={tipo.tipoId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {tipo.cor && (
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: tipo.cor }}
                        />
                      )}
                      <span className="text-sm font-medium text-gray-900">{tipo.nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tipo.cor ? (
                      <span className="text-sm text-gray-900">{tipo.cor}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tipo.gerenteFuncionarioId ? (
                      <span className="text-sm text-gray-900">ID: {tipo.gerenteFuncionarioId}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tipo.centroCustoId ? (
                      <span className="text-sm text-gray-900">ID: {tipo.centroCustoId}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleAtivo(tipo.tipoId, tipo.ativo)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        tipo.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tipo.ativo ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Inativo
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/empresas/${empresaId}/tarefa-tipos/${tipo.tipoId}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Visualizar"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/empresas/${empresaId}/tarefa-tipos/${tipo.tipoId}/editar`)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Editar"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tipo.tipoId)}
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
      )}
    </div>
  );
}
