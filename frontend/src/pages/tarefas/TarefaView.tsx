import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import tarefaService from '../../services/tarefa/tarefa.service';
import type { Tarefa } from '../../models/tarefa/Tarefa.model';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TarefaView: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id: string }>();
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTarefa();
  }, [empresaId, id]);

  const loadTarefa = async () => {
    if (!empresaId || !id) return;
    try {
      setLoading(true);
      const data = await tarefaService.getById(parseInt(empresaId), parseInt(id));
      setTarefa(data);
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      toast.error('Erro ao carregar tarefa');
      navigate(`/empresas/${empresaId}/tarefas`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'PENDENTE': 'bg-gray-100 text-gray-800',
      'EM_ANDAMENTO': 'bg-blue-100 text-blue-800',
      'PAUSADA': 'bg-yellow-100 text-yellow-800',
      'CONCLUIDA': 'bg-green-100 text-green-800',
      'CANCELADA': 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const colors: Record<string, string> = {
      'BAIXA': 'bg-gray-100 text-gray-800',
      'MEDIA': 'bg-blue-100 text-blue-800',
      'ALTA': 'bg-orange-100 text-orange-800',
      'URGENTE': 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colors[prioridade] || 'bg-gray-100 text-gray-800'}`}>
        {prioridade}
      </span>
    );
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
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Tarefa não encontrada</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/tarefas`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes da Tarefa</h1>
            <p className="text-gray-600">Visualize as informações da tarefa</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/tarefas/${id}/editar`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit className="h-5 w-5" />
          Editar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{tarefa.titulo}</h2>
            {tarefa.descricao && (
              <p className="text-gray-600 leading-relaxed">{tarefa.descricao}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1">{getStatusBadge(tarefa.status)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center">
                <div className={`h-3 w-3 rounded-full ${
                  tarefa.prioridade === 'URGENTE' ? 'bg-red-500' :
                  tarefa.prioridade === 'ALTA' ? 'bg-orange-500' :
                  tarefa.prioridade === 'MEDIA' ? 'bg-blue-500' : 'bg-gray-500'
                }`}></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Prioridade</p>
                <div className="mt-1">{getPrioridadeBadge(tarefa.prioridade)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center">
                <div className="h-3 w-3 rounded bg-purple-500"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo ID</p>
                <p className="text-sm text-gray-900">{tarefa.tipoId || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Data de Início</p>
                <p className="text-sm text-gray-900">
                  {tarefa.dataInicio 
                    ? format(new Date(tarefa.dataInicio), 'dd/MM/yyyy', { locale: ptBR })
                    : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Data Prazo</p>
                <p className="text-sm text-gray-900">
                  {tarefa.dataPrazo 
                    ? format(new Date(tarefa.dataPrazo), 'dd/MM/yyyy', { locale: ptBR })
                    : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Criado em</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(tarefa.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Última atualização</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(tarefa.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarefaView;
