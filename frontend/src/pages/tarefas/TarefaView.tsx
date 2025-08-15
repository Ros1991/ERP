import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, Clock, AlertCircle, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import tarefaService from '@/services/tarefa/tarefa.service';
import tarefaTipoService from '@/services/tarefa/tarefaTipo.service';
import { Tarefa } from '@/models/tarefa/Tarefa.model';
import { TarefaTipo } from '@/models/tarefa/TarefaTipo.model';

export default function TarefaView() {
  const { empresaId, tarefaId } = useParams<{ empresaId: string; tarefaId: string }>();
  const navigate = useNavigate();
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [tipo, setTipo] = useState<TarefaTipo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId && tarefaId) {
      loadTarefa();
    }
  }, [empresaId, tarefaId]);

  const loadTarefa = async () => {
    try {
      setLoading(true);
      const data = await tarefaService.getById(Number(empresaId), Number(tarefaId));
      setTarefa(data);
      
      if (data.tipoId) {
        try {
          const tipoData = await tarefaTipoService.getById(Number(empresaId), data.tipoId);
          setTipo(tipoData);
        } catch (error) {
          console.error('Error loading task type:', error);
        }
      }
    } catch (error) {
      console.error('Error loading task:', error);
      toast.error('Erro ao carregar tarefa');
      navigate(`/empresas/${empresaId}/tarefas`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-gray-100 text-gray-800';
      case 'EM_ANDAMENTO': return 'bg-blue-100 text-blue-800';
      case 'PAUSADA': return 'bg-yellow-100 text-yellow-800';
      case 'PARADA': return 'bg-orange-100 text-orange-800';
      case 'CONCLUIDA': return 'bg-green-100 text-green-800';
      case 'CANCELADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'URGENTE': return 'text-red-600';
      case 'ALTA': return 'text-orange-600';
      case 'MEDIA': return 'text-yellow-600';
      case 'BAIXA': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tarefa) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Tarefa não encontrada</p>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/tarefas`)}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/tarefas`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes da Tarefa</h1>
        </div>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/tarefas/${tarefaId}/editar`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={tarefa.isDeleted}
        >
          <Edit className="h-5 w-5" />
          Editar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{tarefa.titulo}</h2>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tarefa.status)}`}>
              {tarefa.status.replace('_', ' ')}
            </span>
            <div className="flex items-center gap-1">
              <AlertCircle className={`h-4 w-4 ${getPrioridadeColor(tarefa.prioridade)}`} />
              <span className="text-sm font-medium text-gray-700">
                Prioridade {tarefa.prioridade}
              </span>
            </div>
            {tipo && (
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{tipo.nome}</span>
                {tipo.cor && (
                  <span
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: tipo.cor }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {tarefa.descricao && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Descrição</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{tarefa.descricao}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Data de Início
              </h3>
              <p className="text-gray-900">
                {tarefa.dataInicio ? new Date(tarefa.dataInicio).toLocaleDateString('pt-BR') : 'Não definida'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Data Prazo
              </h3>
              <p className="text-gray-900">
                {tarefa.dataPrazo ? new Date(tarefa.dataPrazo).toLocaleDateString('pt-BR') : 'Não definida'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Data de Conclusão
              </h3>
              <p className="text-gray-900">
                {tarefa.dataConclusao ? new Date(tarefa.dataConclusao).toLocaleDateString('pt-BR') : 'Não concluída'}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Criado em:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(tarefa.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Atualizado em:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(tarefa.updatedAt).toLocaleString('pt-BR')}
                </span>
              </div>
              {tarefa.isDeleted && tarefa.deletedAt && (
                <div className="md:col-span-2 text-red-600">
                  <span className="text-gray-500">Excluído em:</span>
                  <span className="ml-2">
                    {new Date(tarefa.deletedAt).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
