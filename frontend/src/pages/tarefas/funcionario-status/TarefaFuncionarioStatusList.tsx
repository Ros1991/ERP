import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Trash2, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import tarefaFuncionarioStatusService from '@/services/tarefa/tarefaFuncionarioStatus.service';
import funcionarioService from '@/services/funcionario/funcionario.service';
import { TarefaFuncionarioStatus } from '@/models/tarefa/TarefaFuncionarioStatus.model';
import { Funcionario } from '@/models/funcionario/Funcionario.model';

export default function TarefaFuncionarioStatusList() {
  const { empresaId, tarefaId } = useParams<{ empresaId: string; tarefaId: string }>();
  const navigate = useNavigate();
  const [statusList, setStatusList] = useState<TarefaFuncionarioStatus[]>([]);
  const [funcionarios, setFuncionarios] = useState<Map<number, Funcionario>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId && tarefaId) {
      loadData();
    }
  }, [empresaId, tarefaId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load status list for the task
      const statusData = await tarefaFuncionarioStatusService.getAllByTarefa(
        Number(empresaId),
        Number(tarefaId)
      );
      setStatusList(statusData);

      // Load funcionarios data
      const funcionarioIds = [...new Set(statusData.map(s => s.funcionarioId))];
      const funcionarioMap = new Map<number, Funcionario>();
      
      for (const id of funcionarioIds) {
        try {
          const func = await funcionarioService.getById(Number(empresaId), id);
          funcionarioMap.set(id, func);
        } catch (error) {
          console.error(`Error loading funcionario ${id}:`, error);
        }
      }
      
      setFuncionarios(funcionarioMap);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar status dos funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (statusId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este status?')) {
      return;
    }

    try {
      await tarefaFuncionarioStatusService.delete(Number(empresaId), statusId);
      toast.success('Status excluído com sucesso');
      loadData();
    } catch (error) {
      console.error('Error deleting status:', error);
      toast.error('Erro ao excluir status');
    }
  };

  const handleStatusChange = async (statusId: number, newStatus: TarefaFuncionarioStatus['status']) => {
    try {
      await tarefaFuncionarioStatusService.updateStatus(Number(empresaId), statusId, newStatus);
      toast.success('Status atualizado com sucesso');
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATRIBUIDA': return 'bg-gray-100 text-gray-800';
      case 'EM_ANDAMENTO': return 'bg-blue-100 text-blue-800';
      case 'PAUSADA': return 'bg-yellow-100 text-yellow-800';
      case 'CONCLUIDA': return 'bg-green-100 text-green-800';
      case 'CANCELADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-900">Status dos Funcionários na Tarefa</h1>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/tarefas/${tarefaId}/funcionario-status/novo`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Atribuir Funcionário
        </button>
      </div>

      {statusList.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Nenhum funcionário atribuído a esta tarefa
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atribuído em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statusList.map((status) => {
                const funcionario = funcionarios.get(status.funcionarioId);
                return (
                  <tr key={status.statusId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {funcionario?.nome || `ID: ${status.funcionarioId}`}
                          </div>
                          {funcionario?.cpf && (
                            <div className="text-sm text-gray-500">CPF: {funcionario.cpf}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={status.status}
                        onChange={(e) => handleStatusChange(status.statusId, e.target.value as TarefaFuncionarioStatus['status'])}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status.status)}`}
                      >
                        <option value="ATRIBUIDA">Atribuída</option>
                        <option value="EM_ANDAMENTO">Em Andamento</option>
                        <option value="PAUSADA">Pausada</option>
                        <option value="CONCLUIDA">Concluída</option>
                        <option value="CANCELADA">Cancelada</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {status.observacao || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(status.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/empresas/${empresaId}/tarefas/${tarefaId}/funcionario-status/${status.statusId}/editar`)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(status.statusId)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
